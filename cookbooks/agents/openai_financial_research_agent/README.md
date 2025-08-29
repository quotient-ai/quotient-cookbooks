# Build a Multi-Agent Financial Research System with OpenAI & Quotient Tracing

This example demonstrates how to build a financial research system using multiple specialized agents with the OpenAI Agents SDK. The system is monitored using [Quotient Tracing](https://docs.quotientai.co/data-collection/traces) to provide visibility into the multi-agent workflow.

**NOTE:** This example is pulled and adapted from the OpenAI Agents SDK Examples [here](https://github.com/openai/openai-agents-python/tree/main/examples/financial_research_agent).


## Architecture overview
The system uses a hierarchical approach with specialized agents:

1. **Planning**: A planner agent turns the end user’s request into a list of search terms relevant to financial analysis – recent news, earnings calls, corporate filings, industry commentary, etc.
2. **Search**: A search agent uses the built‑in `WebSearchTool` to retrieve terse summaries for each search term. (You could also add `FileSearchTool` if you have indexed PDFs or 10‑Ks.)
3. **Sub‑analysts**: Additional agents (e.g. a fundamentals analyst and a risk analyst) are exposed as tools so the writer can call them inline and incorporate their outputs.
4. **Writing**: A senior writer agent brings together the search snippets and any sub‑analyst summaries into a long‑form markdown report plus a short executive summary.
5. **Verification**: A final verifier agent audits the report for obvious inconsistencies or missing sourcing.

![Agent Architecture](./openai_financial_research_agent/agent-arch.png)

## Quickstart

1. Install the dependencies:

```
pip install quotientai openai-agents openinference-instrumentation-openai-agents
```

2. Set up your API Keys:

Get your OpenAI API Key from https://platform.openai.com/
```
export OPENAI_API_KEY=your_api_key
```

Get your Quotient API Key from https://app.quotientai.co/ -> Click `Settings`
```
export QUOTIENT_API_KEY=your_api_key
```

3. Run the agent:

```bash
python -m openai_financial_research_agent.main
```

4. Enter a query like:

```
Write up an analysis of Apple Inc.'s most recent quarter.
```

5. Wait for the agent to complete and view the trace in the [Quotient Web UI](https://app.quotientai.co/traces).

The entire multi-agent workflow is automatically traced using Quotient. You can view the traces in the [Quotient Web UI](https://app.quotientai.co/traces), which will show:

1. The sequence of agent activations
2. Each agent's inputs and outputs
3. The search results and context used
4. The verification process and any corrections

![Quotient Web UI](./openai_financial_research_agent/openai-multiagent-traces.png)

You can view the Quotient Tracing setup here at this permalink: https://github.com/quotient-ai/quotient-cookbooks/blob/5cc3b2dd6abff3dd4d3495e0d1dd7001e7250a8d/examples/tracing/openai_financial_research_agent/manager.py#L19-#L47

### Starter prompt

The writer agent is seeded with instructions similar to:

```
You are a senior financial analyst. You will be provided with the original query
and a set of raw search summaries. Your job is to synthesize these into a
long‑form markdown report (at least several paragraphs) with a short executive
summary. You also have access to tools like `fundamentals_analysis` and
`risk_analysis` to get short specialist write‑ups if you want to incorporate them.
Add a few follow‑up questions for further research.
```

You can tweak these prompts and sub‑agents to suit your own data sources and preferred report structure.