"""Repository for managing Crew relationships in Supabase"""
from typing import Dict, List, Optional, Any
from app.models.crew_relations import CrewAgent, CrewTask
from .base_repository import BaseRepository
from .consts import TableNameEnum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CrewAgentRepository(BaseRepository[CrewAgent, CrewAgent, CrewAgent]):
    """Repository for managing Crew-Agent relationships in Supabase"""
    
    def __init__(self, supabase_client):
        """Initialize the repository with Supabase client"""
        super().__init__(supabase_client, TableNameEnum.CREW_AGENTS.value, CrewAgent)
    
    async def get_by_crew(
        self,
        crew_id: int,
        user_id: Optional[str] = None
    ) -> List[CrewAgent]:
        """Get all agents for a specific crew"""
        filters = {"crew_id": crew_id}
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def get_by_agent(
        self,
        agent_id: int,
        user_id: Optional[str] = None
    ) -> List[CrewAgent]:
        """Get all crews for a specific agent"""
        filters = {"agent_id": agent_id}
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation"""
        return data
    
    async def _pre_update(
        self,
        current_item: CrewAgent,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Pre-process data before update"""
        return update_data


class CrewTaskRepository(BaseRepository[CrewTask, CrewTask, CrewTask]):
    """Repository for managing Crew-Task relationships in Supabase"""
    
    def __init__(self, supabase_client):
        """Initialize the repository with Supabase client"""
        super().__init__(supabase_client, TableNameEnum.CREW_TASKS.value, CrewTask)
    
    async def get_by_crew(
        self,
        crew_id: int,
        user_id: Optional[str] = None
    ) -> List[CrewTask]:
        """Get all tasks for a specific crew"""
        filters = {"crew_id": crew_id}
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def get_by_task(
        self,
        task_id: int,
        user_id: Optional[str] = None
    ) -> List[CrewTask]:
        """Get all crews for a specific task"""
        filters = {"task_id": task_id}
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def get_by_agent(
        self,
        agent_id: int,
        user_id: Optional[str] = None
    ) -> List[CrewTask]:
        """Get all tasks assigned to a specific agent"""
        filters = {"assigned_agent_id": agent_id}
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation"""
        return data
    
    async def _pre_update(
        self,
        current_item: CrewTask,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Pre-process data before update"""
        return update_data
