from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from app.celery import app as celery_app
from app.tasks import execute_crew_task

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CrewTaskRequest(BaseModel):
    crew_config: Dict[str, Any]

@app.post("/api/execute-crew")
async def create_crew_task(request: CrewTaskRequest):
    try:
        # Submit task to Celery
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
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "Hello World"}
