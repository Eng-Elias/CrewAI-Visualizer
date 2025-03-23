"""Models for Mission management"""
from typing import Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class MissionData(BaseModel):
    """Model for mission input/output data"""
    text: str = ""


class MissionCreate(BaseModel):
    """Mission creation model"""
    crew_id: int
    name: str
    description: Optional[str] = None
    input_data: MissionData = Field(default_factory=MissionData)
    default_llm_id: Optional[int] = None
    default_llm_model: Optional[str] = None
    manager_llm_id: Optional[int] = None
    manager_llm_model: Optional[str] = None
    function_calling_llm_id: Optional[int] = None
    function_calling_llm_model: Optional[str] = None
    planning_llm_id: Optional[int] = None
    planning_llm_model: Optional[str] = None


class MissionUpdate(BaseModel):
    """Mission update model"""
    name: Optional[str] = None
    description: Optional[str] = None
    input_data: Optional[MissionData] = None
    result_data: Optional[MissionData] = None
    status: Optional[str] = None
    error: Optional[str] = None
    default_llm_id: Optional[int] = None
    default_llm_model: Optional[str] = None
    manager_llm_id: Optional[int] = None
    manager_llm_model: Optional[str] = None
    function_calling_llm_id: Optional[int] = None
    function_calling_llm_model: Optional[str] = None
    planning_llm_id: Optional[int] = None
    planning_llm_model: Optional[str] = None


class Mission(BaseModel):
    """Mission model"""
    id: int
    crew_id: int
    name: str
    description: Optional[str] = None
    input_data: MissionData = Field(default_factory=MissionData)
    result_data: Optional[MissionData] = None
    status: str = "pending"
    error: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user_id: Optional[str] = None
    is_deleted: bool = False
    default_llm_id: Optional[int] = None
    default_llm_model: Optional[str] = None
    manager_llm_id: Optional[int] = None
    manager_llm_model: Optional[str] = None
    function_calling_llm_id: Optional[int] = None
    function_calling_llm_model: Optional[str] = None
    planning_llm_id: Optional[int] = None
    planning_llm_model: Optional[str] = None
    
    @field_validator('input_data', 'result_data', mode='before')
    @classmethod
    def validate_json_data(cls, v):
        """Validate and convert JSON data"""
        if isinstance(v, dict):
            return MissionData(**v)
        return v
    
    class Config:
        """Pydantic config"""
        from_attributes = True
