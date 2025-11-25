import asyncio
import random
import sys
from pathlib import Path
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeRemainingColumn

from demo.manager import FinancialResearchManager

# Entrypoint for the financial bot example.
# Run this as `python -m examples.financial_research_agent.main` and enter a
# financial research query, for example:
# "Write up an analysis of Apple Inc.'s most recent quarter."
async def run(query: str) -> None:
    mgr = FinancialResearchManager()
    await mgr.run(query)

NUM_WORKERS = 50

async def main() -> None:
    # If an argument is provided, run it as a single query
    if len(sys.argv) > 1:
        query = sys.argv[1]
        await run(query)
        return
    
    # Otherwise, run multiple queries from questions.txt
    with open(Path(__file__).parent / "data" / "questions.txt", "r") as f:
        queries = f.readlines()
    random.shuffle(queries)
    
    semaphore = asyncio.Semaphore(NUM_WORKERS)
    
    async def run_with_semaphore(query: str):
        async with semaphore:
            return await run(query)
    
    # Create tasks for all queries
    tasks = [run_with_semaphore(query.strip()) for query in queries]
    
    # Use rich progress bar to track completion
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TimeRemainingColumn(),
        console=None,
    ) as progress:
        task = progress.add_task("[cyan]Processing queries...", total=len(tasks))
        
        # Process tasks as they complete, updating progress bar
        for coro in asyncio.as_completed(tasks):
            await coro
            progress.update(task, advance=1)

if __name__ == "__main__":
    # cd training_demos/openai_financial_research_agent
    # uv run python main.py
    # or
    # uv run python main.py "Write up an analysis of Apple Inc.'s most recent quarter."
    asyncio.run(main())
