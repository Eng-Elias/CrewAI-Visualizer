"""Repository for managing Agents in Supabase"""
from typing import Dict, List, Optional, Any
from app.models.agent import Agent, AgentCreate, AgentUpdate
from .base_repository import BaseRepository
from .consts import TableNameEnum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentRepository(BaseRepository[Agent, AgentCreate, AgentUpdate]):
    """Repository for managing Agents in Supabase"""
    
    def __init__(self, supabase_client):
        """Initialize the repository with Supabase client"""
        super().__init__(supabase_client, TableNameEnum.AGENTS.value, Agent)
    
    async def get_templates(
        self,
        include_builtin: bool = True,
        user_id: Optional[str] = None
    ) -> List[Agent]:
        """Get all template Agents from the database"""
        filters = {
            "is_template": True
        }
        
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
        
        return await self.get_all(filters=filters)
    
    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation"""
        # Ensure built-in agents are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
        return data
    
    async def _pre_update(
        self,
        current_item: Agent,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Pre-process data before update"""
        # Prevent modification of built-in agents
        if current_item.is_builtin:
            raise Exception("Cannot modify built-in agents")
            
        # Ensure built-in agents are also templates
        if update_data.get("is_builtin", False):
            update_data["is_template"] = True
            
        return update_data
