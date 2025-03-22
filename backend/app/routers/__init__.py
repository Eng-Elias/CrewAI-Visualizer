"""Router initialization"""
from .llm_router import LLMRouter
from .agent_router import AgentRouter
from .task_router import TaskRouter
from .crew_router import CrewRouter

# Initialize routers
llm_router = LLMRouter()
agent_router = AgentRouter()
task_router = TaskRouter()
crew_router = CrewRouter()

# List of all routers
routers = [
    llm_router.router,
    agent_router.router,
    task_router.router,
    crew_router.router
]
