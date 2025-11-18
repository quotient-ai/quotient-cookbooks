import asyncio
import random

from .manager import FinancialResearchManager


# Entrypoint for the financial bot example.
# Run this as `python -m examples.financial_research_agent.main` and enter a
# financial research query, for example:
# "Write up an analysis of Apple Inc.'s most recent quarter."
async def run(query: str) -> None:
    mgr = FinancialResearchManager()
    await mgr.run(query)


async def main() -> None:
    with open("questions.txt", "r") as f:
        queries = f.readlines()
    random.shuffle(queries)
    
    semaphore = asyncio.Semaphore(50)
    
    async def run_with_semaphore(query: str):
        async with semaphore:
            return await run(query)
    
    await asyncio.gather(*[run_with_semaphore(query.strip()) for query in queries])

if __name__ == "__main__":
    # python -m cookbooks.agents.openai_financial_research_agent.main
    asyncio.run(main())
