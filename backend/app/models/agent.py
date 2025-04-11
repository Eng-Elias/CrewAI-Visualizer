from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime


class AgentBase(BaseModel):
    """Base model for Agent data"""
    name: str
    role: str
    goal: str
    backstory: Optional[str] = None
    memory_enabled: Optional[bool] = True
    verbose: Optional[bool] = False
    allow_delegation: Optional[bool] = False
    max_iterations: Optional[int] = 10
    max_rpm: Optional[int] = None
    llm_config: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tools: Optional[Dict[str, Any]] = Field(default_factory=dict)
    is_template: Optional[bool] = False
    is_builtin: Optional[bool] = False
    template_id: Optional[int] = None
    template_version: Optional[int] = None
    user_id: Optional[str] = None


class AgentCreate(AgentBase):
    """Model for creating a new Agent"""
    pass


class AgentUpdate(BaseModel):
    """Model for updating an existing Agent"""
    name: Optional[str] = None
    role: Optional[str] = None
    goal: Optional[str] = None
    backstory: Optional[str] = None
    memory_enabled: Optional[bool] = None
    verbose: Optional[bool] = None
    allow_delegation: Optional[bool] = None
    max_iterations: Optional[int] = None
    max_rpm: Optional[int] = None
    llm_config: Optional[Dict[str, Any]] = None
    tools: Optional[Dict[str, Any]] = None
    is_template: Optional[bool] = None
    is_builtin: Optional[bool] = None
    template_id: Optional[int] = None
    template_version: Optional[int] = None


class Agent(AgentBase):
    """Model for Agent with database fields"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
