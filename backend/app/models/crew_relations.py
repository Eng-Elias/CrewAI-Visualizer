"""
Models for crew relationships (crew_agents and crew_tasks).
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class AgentRoleType(str, Enum):
    """Agent role types in a crew"""
    MANAGER = "manager"
    WORKER = "worker"


class CrewAgentBase(BaseModel):
    """Base model for crew-agent relationship"""
    agent_id: int
    agent_order: int
    crew_id: int
    role: Optional[AgentRoleType] = None


class CrewAgent(CrewAgentBase):
    """Model for crew-agent relationship with database fields"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CrewTaskBase(BaseModel):
    """Base model for crew-task relationship"""
    crew_id: int
    task_id: int
    task_order: int
    assigned_agent_id: Optional[int] = None


class CrewTask(CrewTaskBase):
    """Model for crew-task relationship with database fields"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
