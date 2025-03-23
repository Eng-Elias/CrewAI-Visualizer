"""Celery tasks for CrewAI operations"""
from typing import Dict, Any, Optional
from celery import shared_task
from app.services.crew_ai_service import CrewAIService
from app.repositories.crew_repository import CrewRepository
from app.repositories.mission_repository import MissionRepository
from app.core.dependencies import get_supabase_client
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@shared_task(bind=True)
def execute_crew_mission(
    self,
    mission_id: int,
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """Execute a CrewAI mission"""
    try:
        # Initialize dependencies
        supabase_client = get_supabase_client()
        crew_repository = CrewRepository(supabase_client)
        mission_repository = MissionRepository(supabase_client)
        crew_ai_service = CrewAIService(crew_repository, mission_repository)
        
        # Update task state
        self.update_state(
            state='PROGRESS',
            meta={
                'current': 0,
                'total': 1,
                'status_message': 'Starting mission execution...'
            }
        )
        
        # Execute mission
        result = crew_ai_service.execute_mission(mission_id, user_id)
        
        if not result.success:
            raise Exception(result.error)
        
        # Update task state
        self.update_state(
            state='SUCCESS',
            meta={
                'current': 1,
                'total': 1,
                'status_message': 'Mission completed successfully',
                'result': result.result
            }
        )
        
        return {
            'status': 'SUCCESS',
            'result': result.result
        }
        
    except Exception as e:
        logger.error(f"Failed to execute mission: {str(e)}")
        # Update task state
        self.update_state(
            state='FAILURE',
            meta={
                'current': 0,
                'total': 1,
                'status_message': f'Mission failed: {str(e)}'
            }
        )
        raise
