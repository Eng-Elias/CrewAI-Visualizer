from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    """User model for authentication"""
    id: str
    email: Optional[str] = None
