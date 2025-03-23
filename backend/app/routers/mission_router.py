"""Router for managing missions"""
from typing import List, Optional, Dict, Any
from fastapi import Depends, HTTPException
from app.models.mission import Mission, MissionCreate, MissionUpdate
from app.repositories.mission_repository import MissionRepository
from app.services.crew_ai_service import CrewAIService
from app.core.dependencies import (
    get_mission_repository,
    get_crew_ai_service,
    get_current_user,
    get_supabase_client
)
from .base_router import BaseRouter


class MissionRouter(BaseRouter[Mission, MissionCreate, MissionUpdate]):
    """Router for managing missions"""
    
    def __init__(self):
        """Initialize the mission router"""
        super().__init__(
            prefix="/missions",
            repository_class=MissionRepository,
            response_model=Mission,
            create_schema=MissionCreate,
            update_schema=MissionUpdate,
            tags=["missions"]
        )
        self._register_additional_routes()
    
    def _register_additional_routes(self):
        """Register additional mission-specific routes"""
        
        @self.router.get("/crew/{crew_id}", response_model=List[Mission])
        async def get_by_crew_id(
            crew_id: int,
            user=Depends(get_current_user),
            mission_repository: MissionRepository = Depends(get_mission_repository)
        ) -> List[Mission]:
            """Get all missions for a specific crew"""
            try:
                return await mission_repository.get_by_crew_id(crew_id, user["id"])
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.router.post("/{mission_id}/execute")
        async def execute_mission(
            mission_id: int,
            user=Depends(get_current_user),
            crew_ai_service: CrewAIService = Depends(get_crew_ai_service)
        ) -> Dict[str, Any]:
            """Execute a mission"""
            try:
                return await crew_ai_service.execute_mission(mission_id, user["id"])
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    async def _pre_create(
        self,
        data: MissionCreate,
        user_id: Optional[str] = None,
        **kwargs
    ) -> MissionCreate:
        """Pre-process mission data before creation"""
        # Initialize CrewAI service
        supabase_client = kwargs.get("supabase_client")
        if not supabase_client:
            raise HTTPException(status_code=500, detail="Supabase client not available")
            
        crew_ai_service = CrewAIService(
            crew_repository=kwargs.get("crew_repository"),
            mission_repository=kwargs.get("mission_repository"),
            llm_repository=kwargs.get("llm_repository")
        )
        
        # Create mission with proper configuration
        try:
            mission = await crew_ai_service.create_mission(
                crew_id=data.crew_id,
                name=data.name,
                description=data.description,
                input_data=data.input_data.text if data.input_data else None,
                user_id=user_id
            )
            return mission
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
