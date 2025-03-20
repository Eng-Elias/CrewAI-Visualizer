from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime
from crewai import Process

class AgentRole(str, Enum):
    MANAGER = "manager"
    WORKER = "worker"

class CrewBase(BaseModel):
    """Base model for Crew data"""
    name: str = Field(..., description="Name of the crew")
    description: str = Field(..., description="Description of the crew's purpose")
    process: Process = Field(default=Process.sequential, description="Process type (sequential, hierarchical, etc.)")
    verbose: bool = Field(default=False, description="Enable verbose output")
    manager_llm_id: Optional[int] = Field(None, description="The LLM used by the manager agent in a hierarchical process")
    planning_llm_id: Optional[int] = Field(None, description="LLM for planning")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional configuration")
    max_rpm: Optional[int] = Field(default=None, description="Maximum requests per minute")
    language: Optional[str] = Field(default=None, description="Language for the crew")
    memory: Optional[bool] = Field(default=True, description="Enable memory for the crew")
    memory_config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Memory configuration")
    embedder: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Embedder configuration")
    full_output: Optional[bool] = Field(default=True, description="Return full output")
    manager_agent: Optional[int] = Field(default=None, description="ID of the manager agent")
    planning: Optional[bool] = Field(default=False, description="Enable planning")
    is_template: bool = Field(default=False, description="Whether this is a template")
    is_builtin: bool = Field(default=False, description="Whether this is a built-in template")
    user_id: Optional[str] = None


class CrewCreate(CrewBase):
    """Model for creating a new Crew"""
    agents: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="List of agents with their order and role")
    tasks: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="List of tasks with their order")
    template_id: Optional[int] = Field(default=None, description="ID of the template this crew is based on")
    template_version: Optional[int] = Field(default=None, description="Version of the template")


class CrewUpdate(BaseModel):
    """Model for updating an existing Crew"""
    name: Optional[str] = None
    description: Optional[str] = None
    process: Optional[Process] = None
    verbose: Optional[bool] = None
    manager_llm_id: Optional[int] = None
    planning_llm_id: Optional[int] = None
    config: Optional[Dict[str, Any]] = None
    max_rpm: Optional[int] = None
    language: Optional[str] = None
    memory: Optional[bool] = None
    memory_config: Optional[Dict[str, Any]] = None
    embedder: Optional[Dict[str, Any]] = None
    full_output: Optional[bool] = None
    manager_agent: Optional[int] = None
    planning: Optional[bool] = None
    agents: Optional[List[Dict[str, Any]]] = None
    tasks: Optional[List[Dict[str, Any]]] = None
    is_template: Optional[bool] = None
    is_builtin: Optional[bool] = None
    template_id: Optional[int] = None
    template_version: Optional[int] = None


class AgentData(BaseModel):
    """Model for Agent data in relations"""
    id: int
    name: str
    description: Optional[str] = None
    llm_id: Optional[int] = None
    role: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_template: bool = False
    is_builtin: bool = False
    user_id: Optional[str] = None


class TaskData(BaseModel):
    """Model for Task data in relations"""
    id: int
    name: str
    description: Optional[str] = None
    input: Optional[Dict[str, Any]] = None
    expected_output: Optional[str] = None
    tools: Optional[List[str]] = None
    is_template: bool = False
    is_builtin: bool = False
    template_id: Optional[int] = None
    template_version: Optional[int] = None
    user_id: Optional[str] = None


class CrewAgentRelation(BaseModel):
    """Model for Crew Agent Relation"""
    agent_id: int
    role: AgentRole = Field(default=AgentRole.WORKER, description="Role of the agent")
    data: Optional[AgentData] = None


class CrewTaskRelation(BaseModel):
    """Model for Crew Task Relation"""
    task_id: int
    assigned_agent_id: Optional[int] = Field(None, description="ID of the agent assigned to the task")
    data: Optional[TaskData] = None


class Crew(CrewBase):
    """Model for Crew with database fields"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    template_id: Optional[int] = None
    template_version: Optional[int] = None
    crew_agents: List[CrewAgentRelation] = Field(default_factory=list, description="List of agents with their roles")
    crew_tasks: List[CrewTaskRelation] = Field(default_factory=list, description="List of tasks with their assigned agents")

    class Config:
        from_attributes = True
