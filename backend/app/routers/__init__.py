"""Router initialization"""
from .llm_router import LLMRouter
from .agent_router import AgentRouter
from .task_router import TaskRouter
from .crew_router import CrewRouter
from .auth_router import AuthRouter
from .celery_task_router import CeleryTaskRouter

# Initialize routers
llm_router = LLMRouter()
agent_router = AgentRouter()
task_router = TaskRouter()
crew_router = CrewRouter()
auth_router = AuthRouter()
celery_task_router = CeleryTaskRouter()

# List of all routers
routers = [
    llm_router.router,
    agent_router.router,
    task_router.router,
    crew_router.router,
    auth_router.router,
    celery_task_router.router
]
