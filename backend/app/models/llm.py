from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class LLMProvider(str, Enum):
    """Enum for supported LLM providers"""
    DEEPSEEK = "DeepSeek"
    ANTHROPIC = "Anthropic"
    OPENAI = "OpenAI"
    GEMINI = "Gemini"
    OLLAMA = "Ollama"


class LLMBase(BaseModel):
    """Base model for LLM data"""
    name: str
    provider: LLMProvider
    api_key: Optional[str] = None
    models: List[str]
    config: Dict[str, Any] = Field(default_factory=dict)


class LLMCreate(LLMBase):
    """Model for creating a new LLM"""
    pass


class LLMUpdate(BaseModel):
    """Model for updating an existing LLM"""
    name: Optional[str] = None
    provider: Optional[LLMProvider] = None
    api_key: Optional[str] = None
    models: Optional[List[str]] = None
    config: Optional[Dict[str, Any]] = None


class LLM(LLMBase):
    """Model for LLM with database fields"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None

    class Config:
        from_attributes = True
