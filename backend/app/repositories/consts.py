"""Constants for repositories"""
from enum import Enum


class TableNameEnum(str, Enum):
    """Enum for table names"""
    AGENTS = "Agents"
    TASKS = "Tasks"
    CREWS = "Crews"
    LLMS = "LLMs"
    MISSIONS = "Missions"
    CREW_AGENTS = "crew_agents"
    CREW_TASKS = "crew_tasks"
