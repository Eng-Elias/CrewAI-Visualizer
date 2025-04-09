"""Repository for managing Crews in Supabase"""
from typing import Dict, List, Optional, Any
from app.models.crew import Crew, CrewCreate, CrewUpdate
from app.models.crew_relations import CrewAgent, CrewTask
from .base_repository import BaseRepository
from .consts import TableNameEnum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CrewRepository(BaseRepository[Crew, CrewCreate, CrewUpdate]):
    """Repository for managing Crews in Supabase"""
    
    def __init__(self, supabase_client):
        """Initialize the repository with Supabase client"""
        super().__init__(supabase_client, TableNameEnum.CREWS.value, Crew)
    
    async def get_templates(
        self,
        include_builtin: bool = True,
        user_id: Optional[str] = None
    ) -> List[Crew]:
        """Get all template Crews from the database"""
        filters = {"is_template": True}
        
        if include_builtin:
            filters["or"] = {
                "is_builtin": True,
                "user_id": user_id if user_id else None
            }
        else:
            filters["and"] = [
                ["is_builtin", "eq", False],
                ["user_id", "eq", user_id]
            ]
        
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def add_agent(
        self,
        crew_id: int,
        agent_id: int,
        role: str,
        agent_order: int,
        user_id: Optional[str] = None
    ) -> CrewAgent:
        """Add an agent to a crew"""
        data = {
            "crew_id": crew_id,
            "agent_id": agent_id,
            "role": role,
            "agent_order": agent_order
        }
        
        if user_id:
            data["user_id"] = user_id
            
        response = self.supabase.table("CrewAgents").insert(data).execute()
        
        if not response.data:
            logger.error("Failed to add agent to crew")
            raise Exception("Failed to add agent to crew")
            
        return CrewAgent.model_validate(response.data[0])
    
    async def add_task(
        self,
        crew_id: int,
        task_id: int,
        task_order: int,
        assigned_agent_id: Optional[int] = None,
        user_id: Optional[str] = None
    ) -> CrewTask:
        """Add a task to a crew"""
        data = {
            "crew_id": crew_id,
            "task_id": task_id,
            "task_order": task_order,
            "assigned_agent_id": assigned_agent_id
        }
        
        if user_id:
            data["user_id"] = user_id
            
        response = self.supabase.table("CrewTasks").insert(data).execute()
        
        if not response.data:
            logger.error("Failed to add task to crew")
            raise Exception("Failed to add task to crew")
            
        return CrewTask.model_validate(response.data[0])
    
    async def remove_agent(
        self,
        crew_id: int,
        agent_id: int,
        user_id: Optional[str] = None
    ) -> bool:
        """Remove an agent from a crew"""
        query = self.supabase.table("CrewAgents")\
            .delete()\
            .eq("crew_id", crew_id)\
            .eq("agent_id", agent_id)
            
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return bool(response.data)
    
    async def remove_task(
        self,
        crew_id: int,
        task_id: int,
        user_id: Optional[str] = None
    ) -> bool:
        """Remove a task from a crew"""
        query = self.supabase.table("CrewTasks")\
            .delete()\
            .eq("crew_id", crew_id)\
            .eq("task_id", task_id)
            
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return bool(response.data)
    
    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation"""
        # Extract agents and tasks for separate creation
        self.agents_to_create = data.pop("agents", [])
        self.tasks_to_create = data.pop("tasks", [])
        
        # Ensure built-in crews are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
            
        return data
    
    async def _pre_update(
        self,
        current_item: Crew,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Pre-process data before update"""
        # Prevent modification of built-in crews
        if current_item.is_builtin:
            raise Exception("Cannot modify built-in crews")
            
        # Extract agents and tasks for separate update
        self.agents_to_update = update_data.pop("agents", [])
        self.tasks_to_update = update_data.pop("tasks", [])
        
        # Ensure built-in crews are also templates
        if update_data.get("is_builtin", False):
            update_data["is_template"] = True
            
        return update_data
