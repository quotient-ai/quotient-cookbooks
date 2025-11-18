import asyncio
import random
import textwrap

from dotenv import load_dotenv

from agents import Agent, AgentOutputSchema, Runner
from openai import BaseModel

load_dotenv(override=True)

# ------------------------------------------
# Axis Definitions with One-Sentence Descriptions
# ------------------------------------------

A_domain = {
    "single_public_company": "A request centered on analyzing one specific publicly traded company.",
    "sector": "A request focused on understanding patterns or issues within an entire industry sector.",
    "macro_country": "A request that analyzes financial or economic trends at a country or macro level.",
    "event_driven": "A request tied to a particular corporate or market event that changes expectations.",
    "portfolio": "A request examining multi-asset or multi-company portfolios and allocation decisions.",
    "credit_issuer": "A request analyzing a borrower from a credit or fixed income perspective.",
    "esg_theme": "A request exploring environmental, social, or governance considerations within finance.",
    "alt_assets": "A request covering alternative assets such as real estate, private equity or crypto."
}

B_intent = {
    "describe": "The user wants an explanation or summary of financial conditions or performance.",
    "value": "The user seeks an assessment of valuation or pricing relative to fundamentals.",
    "compare": "The user requests a comparison between entities such as companies, sectors or countries.",
    "event_impact": "The user wants analysis of how a specific event affects value or outlook.",
    "risk_analysis": "The user asks for identification and evaluation of downside risks or vulnerabilities.",
    "scenario": "The user wants scenario construction such as base, bull or bear cases.",
    "thematic": "The user wants synthesis of information related to a larger theme or structural trend.",
    "recommend": "The user wants a clear investment recommendation or course of action.",
    "extract_timeline": "The user wants key events, metrics or milestones extracted into a timeline.",
    "verify_claims": "The user wants to evaluate the accuracy or support behind an existing claim or thesis."
}

C_time = {
    "latest_quarter": "Focuses on the most recent quarterly period.",
    "last_year": "Focuses on performance or developments in the most recently completed fiscal year.",
    "last_3y": "Covers multi-year trends across the past three or more years.",
    "upcoming_year": "Targets the outlook or expectations for the coming year.",
    "full_cycle": "Analyzes performance across an entire economic or business cycle.",
    "specific_crisis": "Focuses on a particular crisis period such as COVID or a rate shock.",
    "intraday": "Emphasizes extremely recent, even intraday, news or market reactions."
}

D_perspective = {
    "buy_side_analyst": "The request is framed from the viewpoint of a buy-side equity analyst.",
    "pm": "The request is framed from the viewpoint of a portfolio manager making allocation decisions.",
    "credit_investor": "The request is from the viewpoint of a credit or fixed income investor.",
    "cfo": "The request is from the viewpoint of a corporate CFO evaluating business drivers.",
    "board": "The request reflects a board-level strategic oversight perspective.",
    "regulator": "The request is from the perspective of a regulator assessing systemic or company-level risk.",
    "retail": "The request assumes a retail investor with limited technical background.",
    "journalist": "The request is from the viewpoint of a journalist seeking clear, sourced explanation.",
    "risk_officer": "The request reflects the perspective of a risk officer evaluating exposures and vulnerabilities."
}

# ------------------------------------------
# Random Selection Function
# ------------------------------------------

def sample_axis(axis_dict):
    key = random.choice(list(axis_dict.keys()))
    return key, axis_dict[key]

# ------------------------------------------
# Meta-Prompt Generator
# ------------------------------------------

def generate_prompt_lines():
    """Generate prompt lines by randomly selecting 3 axes and sampling from them."""
    # Define all available axes
    all_axes = [
        ("Domain", A_domain),
        ("Intent", B_intent),
        ("Time Focus", C_time),
        ("Perspective", D_perspective),
    ]
    
    # Randomly select 3 axes
    selected_axes = random.sample(all_axes, 3)
    
    # Sample from selected axes and build prompt lines
    prompt_lines = []
    for axis_name, axis_dict in selected_axes:
        key, desc = sample_axis(axis_dict)
        prompt_lines.append(f"    {axis_name}: {desc}")
    
    return prompt_lines

def generate_meta_prompt(prompt_lines=None):
    """Generate the full meta-prompt template with the prompt lines."""
    if prompt_lines is None:
        prompt_lines = generate_prompt_lines()
    
    meta_prompt = f"""
    You are generating a questions designed to exercise a financial research system. Your task is to create a user question. To guide the structure of that question, use the following guidelines:

{chr(10).join(prompt_lines)}

    Using these elements, craft a natural-language question a user might ask that forces the financial research agent to engage fully across planning, searching, fundamentals analysis, risk analysis, writing and verification. The final questions must satisfy the following requirements:
    - should be specific and realistic
    - should be clearly tied to guidelines provided above BUT should NOT directly restate any of the guidelines (instead, assume the character represented in the guidelines)
    - should be from 20 to 60 words long 
    - should be diverse from one another
    - should be self-contained and not require additional context (for instance you can't talk about something impacting "our" bottom line without mentioning the company name represented by "our")
    """

    return textwrap.dedent(meta_prompt).strip()


class Questions(BaseModel):
    questions: list[str]
    """A list of natural-language questions a user might ask that forces the financial research agent to engage fully across planning, searching, fundamentals analysis, risk analysis, writing and verification."""


async def generate_questions():
    try:
        prompt_lines = generate_prompt_lines()
        meta_prompt = generate_meta_prompt(prompt_lines)
        question_generating_agent = Agent(
            name="QuestionGeneratingAgent",
            instructions=meta_prompt,
            model="gpt-5-mini-2025-08-07",
            output_type=AgentOutputSchema(Questions, strict_json_schema=False),
        )

        result = await Runner.run(question_generating_agent, input="Generate 3 to 7 unique questions.")
        print(f"\nFinished generating questions for: \n{chr(10).join(prompt_lines)}")
        print("\nGenerated questions:")
        for q in result.final_output.questions:
            print(f"\t{q}")
        return result.final_output_as(Questions)
    except Exception as e:
        print(f"Error generating questions: {e}")
        return None

async def main():
    semaphore = asyncio.Semaphore(10)
    total_questions = 0
    
    async def generate_with_semaphore():
        async with semaphore:
            return await generate_questions()
    
    tasks = [generate_with_semaphore() for _ in range(240)]
    
    with open("questions.txt", "w") as f:
        for coro in asyncio.as_completed(tasks):
            question_result = await coro
            if question_result is not None:
                for question_text in question_result.questions:
                    # Remove newline characters and append to file
                    cleaned_question = question_text.replace('\n', ' ').replace('\r', ' ')
                    f.write(cleaned_question + '\n')
                    f.flush()  # Ensure it's written immediately
                    total_questions += 1
    
    print(f"Successfully generated {total_questions} questions")

if __name__ == "__main__":
    # python -m cookbooks.agents.openai_financial_research_agent.scripts.prompt_generation
    asyncio.run(main())
