"""
Financial AI Agent with Quotient Traces

This examples showcases a production-ready financial analysis agent that demonstrates:
- Real-time stock data retrieval and analysis
- Comprehensive tracing and monitoring
- Hallucination detection and document relevance analysis using Quotient AI
- Error handling and logging

Do install the necessary libraries before running the file.
---requirements.txt---
quotientai>=0.4.6
langchain-openai>=0.1.0
langgraph>=0.1.6
openinference-instrumentation-langchain>=0.1.1
yfinance>=0.2.28
python-dotenv>=1.0.0

You also need to set the QUOTIENT_API_KEY and OPENAI_API_KEY
"""

import asyncio
import logging
import sys
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage
from opentelemetry.trace import get_current_span
import yfinance as yf

from quotientai import QuotientAI, DetectionType
from quotientai.tracing import start_span
from openinference.instrumentation.langchain import LangChainInstrumentor

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('financial_agent.log')
    ]
)
logger = logging.getLogger(__name__)

# Initialize Quotient AI with comprehensive tracing
quotient = QuotientAI()
quotient.tracer.init(
    app_name="financial-analyst",
    environment="production",
    instruments=[LangChainInstrumentor()],
    detections=[
        DetectionType.HALLUCINATION,
        DetectionType.DOCUMENT_RELEVANCY
    ]
)
logger.info("Quotient AI initialized successfully")


@tool
def get_stock_data(ticker: str) -> str:
    """Fetch real-time stock data including price, P/E ratio, and market cap."""
    try:
        logger.debug(f"Fetching stock data for ticker: {ticker}")
        stock = yf.Ticker(ticker.upper())
        info = stock.info

        if not info:
            logger.warning(f"No data available for ticker: {ticker}")
            return f"No data available for {ticker.upper()}"

        price = info.get('currentPrice', info.get('regularMarketPrice', 'N/A'))
        pe_ratio = info.get('trailingPE', 'N/A')
        market_cap = info.get('marketCap', 0)

        logger.info(f"Successfully fetched data for {ticker.upper()}")

        return f"""
        {ticker.upper()} Data:
        Price: ${price}
        P/E Ratio: {pe_ratio}
        Market Cap: ${market_cap:,.0f}
        52W High: ${info.get('fiftyTwoWeekHigh', 'N/A')}
        52W Low: ${info.get('fiftyTwoWeekLow', 'N/A')}
        """
    except Exception as e:
        logger.error(f"Error fetching stock data for {ticker}: {e}", exc_info=True)
        return f"Error fetching {ticker}: {str(e)}"


@tool
def calculate_returns(ticker: str, period: str = "1mo") -> str:
    """Calculate stock returns over a specified period.
    Args:
        ticker: Stock ticker symbol
        period: Time period (1d, 5d, 1mo, 3mo, 1y)
    """
    valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y"]

    if period not in valid_periods:
        logger.warning(f"Invalid period '{period}' requested, using default '1mo'")
        period = "1mo"

    try:
        logger.debug(f"Calculating {period} returns for {ticker}")
        stock = yf.Ticker(ticker.upper())
        hist = stock.history(period=period)

        if hist.empty:
            logger.warning(f"No historical data available for {ticker}")
            return f"No data available for {ticker.upper()}"

        start_price = hist['Close'].iloc[0]
        end_price = hist['Close'].iloc[-1]
        return_pct = ((end_price - start_price) / start_price) * 100

        logger.info(f"Calculated {period} return for {ticker.upper()}: {return_pct:+.2f}%")

        return f"{ticker.upper()} {period} return: {return_pct:+.2f}% (${start_price:.2f} → ${end_price:.2f})"
    except Exception as e:
        logger.error(f"Error calculating returns for {ticker}: {e}", exc_info=True)
        return f"Error calculating returns: {str(e)}"


@tool
def get_company_news(ticker: str) -> str:
    """Get latest news headlines for a company."""
    try:
        logger.debug(f"Fetching news for {ticker}")
        stock = yf.Ticker(ticker.upper())
        news = stock.news[:3] if hasattr(stock, 'news') else []

        if not news:
            logger.info(f"No recent news found for {ticker}")
            return f"No recent news for {ticker.upper()}"

        headlines = [f"• {item.get('title', 'No title')} ({item.get('publisher', 'Unknown')})"
                     for item in news]

        logger.info(f"Retrieved {len(news)} news items for {ticker.upper()}")
        return f"Latest {ticker.upper()} news:\n" + "\n".join(headlines)
    except Exception as e:
        logger.error(f"Error fetching news for {ticker}: {e}", exc_info=True)
        return f"Error fetching news: {str(e)}"


@quotient.trace('analyze-financial-query')
async def analyze_financial_query(query: str) -> Dict[str, Any]:
    """Analyze a financial query using an AI agent with comprehensive Quotient tracing."""
    logger.info(f"Processing financial query: {query[:100]}...")

    try:
        # Add custom span to track query preparation
        with start_span('query-preparation'):
            span = get_current_span()
            span.set_attribute('user.query', query)
            span.set_attribute('query.timestamp', datetime.now(timezone.utc).isoformat())

            logger.debug("Initializing financial analyst agent")

            # Create the financial analyst agent
            model = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
            agent = create_react_agent(
                model=model,
                tools=[get_stock_data, calculate_returns, get_company_news]
            )

            system_prompt = SystemMessage(content="""
            You are a professional financial analyst. Use the provided tools to get real data.
            Never make claims without data from tools. If tools don't provide 
            specific information (like ESG scores), explicitly state it's unavailable.
            Be precise and data-driven in your analysis.
            """)

        # Execute the agent with comprehensive tracing
        with start_span('agent-execution'):
            logger.debug("Executing agent with query")

            response = await agent.ainvoke({
                "messages": [system_prompt, {"role": "user", "content": query}]
            })

            final_response = response["messages"][-1].content

            # Get trace context for monitoring
            span = get_current_span()
            trace_context = span.get_span_context()
            trace_id = format(trace_context.trace_id, '032x') if trace_context else None

            # Set span attributes for observability
            span.set_attribute('response.length', len(final_response))
            span.set_attribute('response.preview', final_response[:100])

            logger.info(f"Successfully processed query. Trace ID: {trace_id}")

        return {
            "query": query,
            "response": final_response,
            "trace_id": trace_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    except Exception as e:
        logger.error(f"Failed to analyze financial query: {e}", exc_info=True)
        raise


def analyze_trace_for_issues(trace_id: str) -> Dict[str, Any]:
    """Retrieve and analyze a trace to detect potential issues like hallucinations."""
    logger.debug(f"Analyzing trace: {trace_id}")

    try:
        trace = quotient.traces.get(trace_id=trace_id)
        
        # Convert trace object to dictionary for analysis
        trace_data = {
            'id': getattr(trace, 'id', trace_id),
            'metrics': {
                'total_duration': getattr(trace, 'duration', 'N/A'),
                'tool_calls_count': getattr(trace, 'tool_calls_count', 0),
                'hallucination_detected': getattr(trace, 'hallucination_detected', False)
            },
            'status': getattr(trace, 'status', 'unknown')
        }
        
        return trace_data
        
    except Exception as e:
        logger.warning(f"Could not retrieve trace {trace_id}: {e}")
        # Return a default structure when trace retrieval fails
        return {
            'id': trace_id,
            'metrics': {
                'total_duration': 'N/A',
                'tool_calls_count': 0,
                'hallucination_detected': False
            },
            'status': 'retrieval_failed',
            'error': str(e)
        }


async def run_financial_analysis(queries: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """Run financial analysis on a set of queries with comprehensive monitoring."""
    if queries is None:
        queries = [
            "What's Apple's current stock price and 1-month return?",
            "Compare Microsoft and Google P/E ratios",
            "What's Tesla's ESG score and sustainability initiatives?"  # Tests hallucination detection
        ]

    logger.info(f"Starting financial analysis for {len(queries)} queries")
    results = []

    for i, query in enumerate(queries, 1):
        logger.info(f"Processing query {i}/{len(queries)}: {query[:50]}...")

        try:
            # Execute query with comprehensive tracing
            result = await analyze_financial_query(query)

            # Analyze the trace for potential issues
            if result['trace_id']:
                trace_analysis = analyze_trace_for_issues(result['trace_id'])
                result['trace_analysis'] = trace_analysis

                # Check for potential hallucinations in ESG-related queries
                if 'esg' in query.lower() or 'sustainability' in query.lower():
                    if 'esg' in result['response'].lower() or 'sustainability' in result['response'].lower():
                        logger.warning(
                            f"Potential hallucination detected: Response mentions ESG/sustainability "
                            f"but tools don't provide this data. Trace ID: {result['trace_id']}"
                        )
                        result['warning'] = "Response may contain unverified ESG information"

            results.append(result)
            logger.info(f"Successfully processed query {i}. Trace ID: {result.get('trace_id')}")

        except Exception as e:
            logger.error(f"Failed to process query {i}: {e}", exc_info=True)
            results.append({
                "query": query,
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            })

    logger.info(f"Financial analysis complete. Processed {len(results)} queries")
    return results


def display_analysis_results(results: List[Dict[str, Any]]) -> None:
    """Display analysis results in a formatted manner."""
    logger.info("Financial Analysis Results:")

    for i, result in enumerate(results, 1):
        logger.info(f"\nQuery {i}: {result['query']}")
        logger.info("-" * 50)

        if 'error' in result:
            logger.error(f"Error: {result['error']}")
            continue

        # Display response preview
        response = result.get('response', '')
        preview = response[:200] + "..." if len(response) > 200 else response
        logger.info(f"Response: {preview}")
        logger.info(f"Trace ID: {result.get('trace_id', 'N/A')}")

        # Display trace analysis if available
        if 'trace_analysis' in result:
            analysis = result['trace_analysis']
            if isinstance(analysis, dict) and 'metrics' in analysis:
                logger.info("Trace Metrics:")
                logger.info(f"  Duration: {analysis['metrics'].get('total_duration', 'N/A')}")
                logger.info(f"  Tool Calls: {analysis['metrics'].get('tool_calls_count', 0)}")
                logger.info(f"  Hallucination Detected: {analysis['metrics'].get('hallucination_detected', False)}")
            elif 'error' in analysis:
                logger.info(f"  Trace retrieval: {analysis.get('status', 'failed')}")

        # Display warnings if any
        if 'warning' in result:
            logger.warning(f"⚠️  {result['warning']}")

    logger.info("QuotientAI Integration")
    logger.info("\nAccessing Traces:")
    logger.info("1. Programmatically: quotient.traces.get(trace_id='<trace-id>')")
    logger.info("2. Web Dashboard: https://app.quotientai.co/traces")
    logger.info("3. Real-time Monitoring: Automatic hallucination detection enabled")


async def main() -> None:
    """Main entry point for the financial AI agent."""
    try:
        logger.info("Starting Financial AI Agent with Quotient Traces")

        # Run analysis with default queries
        results = await run_financial_analysis()

        # Display formatted results
        display_analysis_results(results)

        logger.info("Financial AI Agent execution completed successfully")

    except KeyboardInterrupt:
        logger.info("Execution interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error in main execution: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        logger.critical(f"Application failed to start: {e}")
        sys.exit(1)
