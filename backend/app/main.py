import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Dict, Any

from app.celery import app as celery_app
from app.tasks import execute_crew_task
from app.core.dependencies import supabase_client, security

# Set default encryption key if not provided
if not os.getenv("ENCRYPTION_KEY"):
    os.environ["ENCRYPTION_KEY"] = "YourDefaultEncryptionKeyForDevelopment=="

app = FastAPI(
    title=os.getenv('APP_TITLE', 'CrewAI Visualizer API'),
    description=os.getenv('APP_DESCRIPTION', 'API for CrewAI Visualizer'),
    version=os.getenv('APP_VERSION', '1.0.0')
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('CORS_ORIGINS', '*').split(','),
    allow_credentials=os.getenv('CORS_CREDENTIALS', 'True').lower() == 'true',
    allow_methods=os.getenv('CORS_METHODS', '*').split(','),
    allow_headers=os.getenv('CORS_HEADERS', '*').split(','),
)

class CrewTaskRequest(BaseModel):
    crew_config: Dict[str, Any]

class UserSignUp(BaseModel):
    email: str
    password: str

class UserSignIn(BaseModel):
    email: str
    password: str

@app.post("/auth/signup")
async def sign_up(user: UserSignUp):
    try:
        response = supabase_client.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        return {"message": "User created successfully", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/signin")
async def sign_in(user: UserSignIn):
    try:
        response = supabase_client.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": response.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/auth/me")
async def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Verify the JWT token
        user = supabase_client.auth.get_user(credentials.credentials)
        return {"user": user.user}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.post("/api/execute-crew")
async def create_crew_task(request: CrewTaskRequest):
    try:
        task = execute_crew_task.delay(request.crew_config)
        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/task/{task_id}")
async def get_task_status(task_id: str):
    try:
        task = celery_app.AsyncResult(task_id)
        if task.state == 'PENDING':
            response = {
                'status': 'pending',
                'result': None
            }
        elif task.state == 'FAILURE':
            response = {
                'status': 'error',
                'result': str(task.result)
            }
        else:
            response = {
                'status': task.state,
                'result': task.result
            }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv('ENVIRONMENT', 'development')
    }

@app.get("/")
async def read_root():
    """Root endpoint for the API"""
    return {
        "message": os.getenv('API_WELCOME_MESSAGE', 'Welcome to CrewAI Visualizer API'),
        "version": os.getenv('APP_VERSION', '1.0.0')
    }

# Import and include routers after FastAPI app is created
from app.routers import routers
for router in routers:
    app.include_router(router)
