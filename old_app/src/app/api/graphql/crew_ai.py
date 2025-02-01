import os

from textwrap import dedent
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools.ddg_search import DuckDuckGoSearchRun
from langchain_community.tools.semanticscholar.tool import SemanticScholarQueryRun
from langchain_community.tools.wikidata.tool import WikidataAPIWrapper, WikidataQueryRun
from langchain_community.tools.wikipedia.tool import WikipediaQueryRun
from langchain_community.utilities.wikipedia import WikipediaAPIWrapper
from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool
from langchain_community.tools.youtube.search import YouTubeSearchTool
from langchain_community.tools.arxiv.tool import ArxivQueryRun
from langchain_community.tools.pubmed.tool import PubmedQueryRun
from dotenv import load_dotenv

load_dotenv()

process_type = {
    "SEQUENTIAL": Process.sequential,
    "HIERARCHICAL": Process.hierarchical,
}

tool_dict = {
    "DUCK_DUCK_GO_SEARCH": DuckDuckGoSearchRun(),
    "SEMANTIC_SCHOLER": SemanticScholarQueryRun(),
    "WIKIDATA": WikidataQueryRun(api_wrapper=WikidataAPIWrapper()),
    "WIKIPEDIA": WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper()),
    "YAHOO_FINANCE": YahooFinanceNewsTool(),
    "YUOUTUBE_SEARCH": YouTubeSearchTool(),
    "ARXIV": ArxivQueryRun(),
    "PUBMED": PubmedQueryRun(),
}


def run_mission(mission):
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            verbose=True,
            temperature=0.5,
            google_api_key=os.getenv("GEMINI_API_KEY"),
        )

        agents = [
            Agent(
                role=agent["role"],
                goal=agent["goal"],
                backstory=agent["backstory"],
                allow_delegation=agent["allowDelegation"],
                verbose=agent["verbose"],
                tools=[tool_dict[tool] for tool in agent["tools"]],
                llm=llm,
                max_rpm=60 / len(mission["crew"]),
                memory=agent.get("memory", False),
            )
            for agent in mission["crew"]
        ]

        tasks = [
            Task(
                description=dedent(task["description"]),
                agent=(
                    [agent for agent in agents if agent.role == task["agent"]["role"]][
                        0
                    ]
                    if task["agent"]
                    else None
                ),
                expected_output=task["expected_output"],
            )
            for task in mission["tasks"]
        ]

        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=mission["verbose"],
            process=process_type[mission["process"]],
            manager_llm=llm,
        )

        result = crew.kickoff()
        return {"result": result}
    except Exception as e:
        print(e)
        return {"error": True, "message": str(e)}
