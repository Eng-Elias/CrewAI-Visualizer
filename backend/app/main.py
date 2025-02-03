import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from app.celery import app as celery_app
from app.tasks import execute_crew_task

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
async def root():
    return {
        "message": os.getenv('API_WELCOME_MESSAGE', 'Welcome to CrewAI Visualizer API'),
        "version": os.getenv('APP_VERSION', '1.0.0')
    }
