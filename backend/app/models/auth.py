"""Auth models for the API"""
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class UserSignUp(BaseModel):
    """User signup request model"""
    email: EmailStr
    password: str


class UserSignIn(BaseModel):
    """User signin request model"""
    email: EmailStr
    password: str


class AuthRequest(BaseModel):
    """Auth request model"""
    access_token: str


class AuthResponse(BaseModel):
    """Auth response model"""
    user_id: str
    email: Optional[str] = None
    access_token: str
    token_type: str = "bearer"


class AuthUser(BaseModel):
    """Auth user model"""
    id: str
    email: Optional[EmailStr] = None
    user_metadata: Optional[Dict[str, Any]] = None


class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: str
    user: AuthUser
