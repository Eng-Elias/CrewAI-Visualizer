from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime


class TaskBase(BaseModel):
    """Base model for Task data"""
    name: str
    description: str
    expected_output: str
    agent: int
    tools: Optional[Dict[str, Any]] = Field(default_factory=dict)
    async_execution: bool = False
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)
    is_template: bool = False
    is_builtin: bool = False


class TaskCreate(TaskBase):
    """Model for creating a new Task"""
    output_json: Optional[Dict[str, Any]] = None
    context: Optional[List[int]] = None
    template_id: Optional[int] = None
    template_version: Optional[int] = None


class TaskUpdate(BaseModel):
    """Model for updating an existing Task"""
    name: Optional[str] = None
    description: Optional[str] = None
    expected_output: Optional[str] = None
    agent: Optional[int] = None
    tools: Optional[Dict[str, Any]] = None
    async_execution: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None
    output_json: Optional[Dict[str, Any]] = None
    context: Optional[List[int]] = None
    is_template: Optional[bool] = None
    is_builtin: Optional[bool] = None
    template_id: Optional[int] = None
    template_version: Optional[int] = None


class Task(TaskBase):
    """Model for Task with database fields"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    output_json: Optional[Dict[str, Any]] = None
    context: Optional[List[int]] = None
    template_id: Optional[int] = None
    template_version: Optional[int] = 1
    user_id: Optional[str] = None

    class Config:
        from_attributes = True
