import os

from textwrap import dedent
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

process_type = {
    "SEQUENTIAL": Process.sequential,
    "HIERARTICAL": Process.hierarchical,
}


def run_mission(mission):
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
            llm=llm,
        )
        for agent in mission["crew"]
    ]

    tasks = [
        Task(
            description=dedent(task["description"]),
            agent=(
                [agent for agent in agents if agent.role == task["agent"]["role"]][0]
                if task["agent"]
                else None
            ),
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
    return result
