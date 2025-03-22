"""Router for Celery task endpoints"""
from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.celery import app as celery_app
from app.celery_tasks.example import execute_crew_task


class CrewTaskRequest(BaseModel):
    """Request model for crew execution task"""
    crew_config: Dict[str, Any]


class CeleryTaskRouter:
    """Router for Celery task endpoints"""
    
    def __init__(self):
        """Initialize the Celery task router"""
        self.router = APIRouter(
            prefix="/celery_task",
            tags=["Celery Tasks"]
        )
        self._register_routes()
    
    def _register_routes(self):
        """Register Celery task routes"""
        
        @self.router.post("/execute-crew")
        async def create_crew_task(request: CrewTaskRequest):
            """Execute a crew task asynchronously"""
            try:
                task = execute_crew_task.delay(request.crew_config)
                return {"celery_task_id": task.id}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.router.get("/{task_id}")
        async def get_task_status(task_id: str):
            """Get the status of a Celery task"""
            try:
                task = celery_app.AsyncResult(task_id)
                if task.state == 'PENDING':
                    response = {
                        'status': task.state,
                        'current': 0,
                        'total': 1,
                        'status_message': 'Pending...'
                    }
                elif task.state != 'FAILURE':
                    response = {
                        'status': task.state,
                        'current': task.info.get('current', 0),
                        'total': task.info.get('total', 1),
                        'status_message': task.info.get('status_message', '')
                    }
                    if 'result' in task.info:
                        response['result'] = task.info['result']
                else:
                    response = {
                        'status': task.state,
                        'current': 1,
                        'total': 1,
                        'status_message': str(task.info),
                        'error': str(task.info)
                    }
                return response
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
