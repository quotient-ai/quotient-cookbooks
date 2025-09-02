<<<<<<< HEAD
<p align="center">
  <img src="./assets/quotient-wordmark.png" alt="Quotient Logo" width="300" />
</p>

<p align="center">
  <img src="./assets/QuotientDetections.png" alt="Quotient's Dashboard" width="700" />
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/quotient-ai/quotient-alpha?style=flat-square&color=2D723C" />
  <img alt="Last Commit" src="https://img.shields.io/github/last-commit/quotient-ai/quotient-alpha?style=flat-square&color=1D91F0" />
  <img alt="Contributions welcome" src="https://img.shields.io/badge/Contributions-welcome-F7693C?style=flat-square" />
  <img alt="Powered by Quotient" src="https://img.shields.io/badge/powered%20by-QuotientAI-CEC825?style=flat-square" />
</p>

<p align="center">
  <a href="https://app.quotientai.co">App</a> •
  <a href="https://docs.quotientai.co">Docs</a> •
  <a href="https://blog.quotientai.co">Blog</a> •
  <a href="https://discord.com/invite/YeJzANpntv">Discord</a>
</p>

<p align="center">
  <em><a href="https://app.quotientai.co">Try Quotient Now (Free)</a></em>
</p>

------

This repository contains cookbooks and examples demonstrating how to monitor and evaluate AI systems for hallucinations, retrieval quality, and other reliability issues using [Quotient AI](https://www.quotientai.co/).

## What You Can Do

- **Build and Monitor AI Agents**: Track LangChain agents in real-time
- **Evaluate Search Quality**: Automatically detect when AI search results contain unsupported claims
- **Improve AI Reliability**: Get insights into common failure patterns and how to fix them
- **Production Monitoring**: Set up automated monitoring for your AI applications

## Getting Started
Visit [app.quotientai.co](https://app.quotientai.co), sign up for a free account, and grab an API key from Settings. **Quotient is completely free to get started!** Check out the [pricing page](https://www.quotientai.co/pricing) for details on free tier limits and paid plans.

## Cookbooks

| Notebook | Description | Open | Resources |
|----------|-------------|------|-----------|
| [Build a LIve Web Documentation Q&A Agent with Qdrant](cookbooks/rag/qdrant/qdrant-quotient-detections.ipynb) | This notebook demonstrates how to build a documentation QA system using Qdrant for vector storage, Tavily for web crawling, and Quotient for monitoring answer quality and hallucinations. | [Open Notebook](cookbooks/rag/qdrant/qdrant-quotient-detections.ipynb) | [Qdrant](https://github.com/qdrant/qdrant), [Tavily](https://github.com/tavily-ai), [OpenAI](https://github.com/OPENAI), [Langchain](https://github.com/langchain-ai/langchain), [Quotient](https://github.com/quotient-ai) |
| [Evaluate AI Search Quality with Tavily](cookbooks/search/tavily/tavily-quotient-detections.ipynb) | This notebook demonstrates how to use Quotient to detect hallucinations and document relevancy in search results using Tavily. | [Open Notebook](cookbooks/search/tavily/tavily-quotient-detections.ipynb) | [Tavily](https://github.com/tavily-ai), [Quotient](https://github.com/quotient-ai) |
| [Build a Company Research Tool with Linkup](cookbooks/search/linkup/linkup-quotient-detections.ipynb) | This notebook demonstrates how to use Linkup's AI search capabilities to research companies while monitoring result quality with Quotient. | [Open Notebook](cookbooks/search/linkup/linkup-quotient-detections.ipynb) | [Linkup](https://github.com/LinkupPlatform), [Quotient](https://github.com/quotient-ai) |
| [Evaluate AI Search Quality with Exa](cookbooks/search/exa/exa-quotient-detections.ipynb) | This notebook demonstrates how to use Quotient to detect hallucinations and document relevancy in search results using Exa `/answer`. | [Open Notebook](cookbooks/search/exa/exa-quotient-detections.ipynb) | [Exa](https://exa.ai), [Quotient](https://github.com/quotient-ai) |
| [Build a RAG Pipeline with Exa Search & OpenAI](cookbooks/search/exa/exa-oai-quotient-detections.ipynb) | This notebook demonstrates how to use Exa for web search, OpenAI for generating answers from search results, and Quotient for monitoring search quality and detecting hallucinations. | [Open Notebook](cookbooks/search/exa/exa-quotient-detections.ipynb) | [Exa](https://github.com/ogham/exa), [OpenAI](https://github.com/OPENAI), [Quotient](https://github.com/quotient-ai) |
| [Build and Monitor a Web Research Agent](cookbooks/agents/research/tavily-quotient-agent.ipynb) | This notebook demonstrates how to use Quotient to monitor and evaluate a research agent that browses the web and answers questions using the Tavily API. | [Open Notebook](cookbooks/agents/research/tavily-quotient-agent.ipynb) | [Langchain](https://github.com/langchain-ai/langchain), [Tavily](https://github.com/tavily-ai), [OpenAI](https://github.com/OPENAI), [Quotient](https://github.com/quotient-ai) |
| [Build and Monitor an Exa Research Agent](cookbooks/agents/research/exa-quotient-agent.ipynb) | This notebook demonstrates how to use Quotient to monitor and evaluate a research agent that leverages Exa's Python SDK for advanced web search and document retrieval. | [Open Notebook](cookbooks/agents/research/exa-quotient-agent.ipynb) | [Langgraph](https://github.com/langchain-ai/langgraph), [Exa](https://github.com/ogham/exa), [Anthropic](https://github.com/anthropics), [Quotient](https://github.com/quotient-ai) |
| [Build a Multi-Agent Financial Research System with OpenAI & Quotient Tracing](cookbooks/agents/openai_financial_research_agent/README.md) | This notebook demonstrates how to build a financial research system using multiple specialized agents with the OpenAI Agents SDK. The system is monitored using Quotient Tracing to provide visibility into the multi-agent workflow. | [README](cookbooks/agents/openai_financial_research_agent/README.md) | [OpenAI](https://github.com/OPENAI), [Quotient](https://github.com/quotient-ai) |

## Contributing
This repository contains research and examples for AI reliability. Feel free to:
- Run the notebooks and share your results
- Report issues or suggest improvements
- Contribute new examples or use cases

## Additional Resources

- [Quotient Documentation](https://docs.quotientai.co/)
- [Quotient App](https://app.quotientai.co/)
- [Quotient Blog](https://blog.quotientai.co/)


**You can reach the Quotient team at research@quotientai.co**
=======
# Fireplexity

A blazing-fast AI search engine powered by Firecrawl's web scraping API. Get intelligent answers with real-time citations and live data.

## Demo

## Features

- **Real-time Web Search** - Powered by Firecrawl's search API
- **AI Responses** - Streaming answers with GPT-4
- **Source Citations** - Every claim backed by references
- **Live Stock Data** - Automatic TradingView charts
- **Smart Follow-ups** - AI-generated questions

## Quick Start

### Clone & Install
```bash
git clone https://github.com/mendableai/fireplexity.git
cd fireplexity
npm install
```

### Set API Keys
```bash
cp .env.example .env.local
```

Add to `.env.local`:
```
FIRECRAWL_API_KEY=fc-your-api-key
OPENAI_API_KEY=sk-your-api-key
```

### Run
```bash
npm run dev
```

Visit http://localhost:3000

## Tech Stack

- **Firecrawl** - Web scraping API
- **Next.js 15** - React framework
- **OpenAI** - GPT-4
- **Vercel AI SDK** - Streaming
- **TradingView** - Stock charts

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmendableai%2Ffireplexity)

## Resources

- [Firecrawl Docs](https://docs.firecrawl.dev)
- [Get API Key](https://firecrawl.dev)
- [Discord Community](https://discord.gg/firecrawl)

## License

MIT License

---

Powered by [Firecrawl](https://firecrawl.dev)
>>>>>>> ad804ad (prep for go-live)
