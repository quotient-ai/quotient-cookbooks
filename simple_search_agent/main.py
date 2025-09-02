from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Optional, List

from quotientai import QuotientAI, DetectionType
from openai import AsyncOpenAI

# Initialize Quotient with tracing and detections
quotient = QuotientAI()
quotient.tracer.init(
    app_name="simple-search-agent",
    environment="dev",
    detections=[DetectionType.HALLUCINATION, DetectionType.DOCUMENT_RELEVANCY],
    detection_sample_rate=1.0
)

@dataclass
class SearchResult:
    query: str
    documents: List[str]
    analysis: Optional[str] = None

class SimpleSearchAgent:
    """A simple agent that performs document search and analysis with tracing."""
    
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)
        self.documents = [
            "Paris is the capital of France and is known for the Eiffel Tower.",
            "The Louvre Museum houses the Mona Lisa painting.",
            "French cuisine is famous for croissants and baguettes."
        ]
    
    @quotient.trace("search-documents")
    async def search_documents(self, query: str) -> SearchResult:
        """Search through documents with tracing."""
        # Simple document search simulation
        relevant_docs = [doc for doc in self.documents if any(term in doc.lower() for term in query.lower().split())]
        
        # Log the search operation
        quotient.log(
            user_query=query,
            documents=relevant_docs,
            tags={"operation": "document_search"}
        )
        
        return SearchResult(query=query, documents=relevant_docs)
    
    @quotient.trace("analyze-results")
    async def analyze_results(self, search_result: SearchResult) -> SearchResult:
        """Analyze search results using LLM with tracing."""
        if not search_result.documents:
            return SearchResult(
                query=search_result.query,
                documents=search_result.documents,
                analysis="No relevant documents found."
            )
        
        # Use OpenAI to analyze the results
        prompt = f"""
        Query: {search_result.query}
        Documents found:
        {chr(10).join(f'- {doc}' for doc in search_result.documents)}
        
        Please provide a brief analysis of these documents in relation to the query.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful research assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        
        analysis = response.choices[0].message.content
        
        # Log the analysis operation
        quotient.log(
            user_query=search_result.query,
            model_output=analysis,
            documents=search_result.documents,
            tags={"operation": "document_analysis"}
        )
        
        return SearchResult(
            query=search_result.query,
            documents=search_result.documents,
            analysis=analysis
        )

    @quotient.trace("search-and-analyze")
    async def search_and_analyze(self, query: str) -> SearchResult:
        """Main workflow combining search and analysis with tracing."""
        # Search documents
        search_result = await self.search_documents(query)
        
        # Analyze results
        analyzed_result = await self.analyze_results(search_result)
        
        return analyzed_result

async def main():
    # Replace with your OpenAI API key
    agent = SimpleSearchAgent(api_key="your-openai-api-key")
    
    # Get user input
    query = input("Enter your search query about France: ")
    
    try:
        # Run the agent
        result = await agent.search_and_analyze(query)
        
        # Print results
        print("\nResults:")
        print(f"Query: {result.query}")
        print("\nRelevant Documents:")
        for doc in result.documents:
            print(f"- {doc}")
        print(f"\nAnalysis: {result.analysis}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())