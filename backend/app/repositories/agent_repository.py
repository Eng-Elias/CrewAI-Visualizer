from typing import List, Optional, Dict, Any
from app.models.agent import AgentCreate, AgentUpdate
from supabase import Client
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentRepository:
    """Repository for managing Agents in Supabase"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.table = "Agents"
    
    async def get_all(self, include_templates: bool = True, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all Agents from the database
        
        Args:
            include_templates: If True, include template agents in the results
            user_id: Filter agents by user_id for RLS compliance
        """
        query = self.supabase.table(self.table).select("*")
        
        if not include_templates:
            query = query.eq("is_template", False)
        
        # Filter by user_id if provided (for RLS)
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return response.data
    
    async def get_templates(self, include_builtin: bool = True, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all template Agents from the database
        
        Args:
            include_builtin: If True, include built-in templates in the results
            user_id: Filter agents by user_id for RLS compliance
        """
        query = self.supabase.table(self.table).select("*").eq("is_template", True)
        
        # Filter by user_id if provided (for RLS)
        if user_id:
            query = query.eq("user_id", user_id)

        if include_builtin:
            query = query.or_("is_builtin", True)
            
        response = query.execute()
        return response.data
    
    async def get_by_id(self, agent_id: int, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get an Agent by its ID
        
        Args:
            agent_id: The ID of the agent to retrieve
            user_id: Filter by user_id for RLS compliance
        """
        query = self.supabase.table(self.table).select("*").eq("id", agent_id)
        
        # Filter by user_id if provided (for RLS)
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            return None
            
        return response.data[0]
    
    async def create(self, agent_data: AgentCreate, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Create a new Agent in the database"""
        # Convert to dict for Supabase
        data = agent_data.model_dump()
        
        # Add user ID if provided
        if user_id:
            data["user_id"] = user_id
            
        # Ensure built-in agents are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
        
        # Insert into Supabase
        response = self.supabase.table(self.table).insert(data).execute()
        
        if not response.data:
            logger.error("Failed to create agent")
            raise Exception("Failed to create agent")
            
        return response.data[0]
    
    async def update(self, agent_id: int, agent_data: AgentUpdate, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Update an existing Agent in the database"""
        # Get the current agent to check if it's built-in
        current_agent = await self.get_by_id(agent_id, user_id)
        if not current_agent:
            raise Exception(f"Agent with ID {agent_id} not found or you don't have permission to access it")
            
        # Only admins can update built-in agents (this check should be in the router)
        if current_agent.get("is_builtin", False):
            # Logic for admin check will be in the router
            pass
            
        # Convert to dict for Supabase
        data = agent_data.model_dump(exclude_unset=True)
        
        # Ensure built-in agents are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
            
        # Update in Supabase
        query = self.supabase.table(self.table).update(data).eq("id", agent_id)

        # Add user_id filter for RLS compliance
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            logger.error(f"Failed to update agent with ID {agent_id}")
            raise Exception(f"Failed to update agent with ID {agent_id} or you don't have permission to update it")
            
        return response.data[0]
    
    async def delete(self, agent_id: int, user_id: Optional[str] = None) -> bool:
        """Delete an Agent from the database"""
        # Get the current agent to check if it's built-in
        current_agent = await self.get_by_id(agent_id, user_id)
        if not current_agent:
            raise Exception(f"Agent with ID {agent_id} not found or you don't have permission to access it")
            
        # Only admins can delete built-in agents (this check should be in the router)
        if current_agent.get("is_builtin", False):
            # Logic for admin check will be in the router
            pass
            
        # Delete from Supabase
        query = self.supabase.table(self.table).delete().eq("id", agent_id)
        
        # Add user_id filter for RLS compliance
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        return len(response.data) > 0
