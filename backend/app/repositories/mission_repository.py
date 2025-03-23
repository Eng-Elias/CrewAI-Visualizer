"""Repository for managing Missions in Supabase"""
from typing import Dict, List, Optional, Any
from app.models.mission import Mission, MissionCreate, MissionUpdate, MissionData
from .base_repository import BaseRepository
from .consts import TableNameEnum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MissionRepository(BaseRepository[Mission, MissionCreate, MissionUpdate]):
    """Repository for managing Missions in Supabase"""
    
    def __init__(self, supabase_client):
        """Initialize the repository with Supabase client"""
        super().__init__(supabase_client, TableNameEnum.MISSIONS.value, Mission)
    
    async def get_by_crew_id(
        self,
        crew_id: int,
        user_id: Optional[str] = None
    ) -> List[Mission]:
        """Get all missions for a crew"""
        filters = {"crew_id": crew_id}
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def update_status(
        self,
        mission_id: int,
        status: str,
        result_data: Optional[Dict[str, Any]] = None,
        error: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Mission:
        """Update mission status and result"""
        update_data = {
            "status": status,
            "result_data": MissionData(text=result_data.get("text", "")) if result_data else None,
            "error": error
        }
        return await self.update(mission_id, MissionUpdate(**update_data), user_id)
    
    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation"""
        # Convert input_data to proper format
        if "input_data" in data:
            data["input_data"] = {"text": data["input_data"].text}
        return data
    
    async def _pre_update(self, existing: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before update"""
        # Convert input_data and result_data to proper format
        if "input_data" in data:
            data["input_data"] = {"text": data["input_data"].text}
        if "result_data" in data:
            data["result_data"] = {"text": data["result_data"].text} if data["result_data"] else None
        return data
