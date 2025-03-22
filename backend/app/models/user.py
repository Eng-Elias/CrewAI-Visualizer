"""User model for the API"""
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class User(BaseModel):
    """User model"""
    id: str
    email: Optional[EmailStr] = None
    user_metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        """Pydantic config"""
        from_attributes = True
