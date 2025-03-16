from typing import List, Optional, Dict, Any
from app.models.task import TaskCreate, TaskUpdate
from supabase import Client
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaskRepository:
    """Repository for managing Tasks in Supabase"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.table = "Tasks"
    
    async def get_all(self, include_templates: bool = True, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all Tasks from the database
        
        Args:
            include_templates: If True, include template tasks in the results
            user_id: Filter tasks by user_id for RLS compliance
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
        """Get all template Tasks from the database
        
        Args:
            include_builtin: If True, include built-in templates in the results
            user_id: Filter tasks by user_id for RLS compliance
        """
        query = self.supabase.table(self.table).select("*").eq("is_template", True)
        
        if not include_builtin:
            query = query.eq("is_builtin", False)
            
        # Filter by user_id if provided (for RLS)
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return response.data
    
    async def get_by_id(self, task_id: int, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get a Task by its ID
        
        Args:
            task_id: The ID of the task to retrieve
            user_id: Filter by user_id for RLS compliance
        """
        query = self.supabase.table(self.table).select("*").eq("id", task_id)
        
        # Filter by user_id if provided (for RLS)
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            return None
            
        return response.data[0]
    
    async def get_by_agent(self, agent_id: int, include_templates: bool = False, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all Tasks for a specific Agent
        
        Args:
            agent_id: The ID of the agent to get tasks for
            include_templates: If True, include template tasks in the results
            user_id: Filter tasks by user_id for RLS compliance
        """
        query = self.supabase.table(self.table).select("*").eq("agent", agent_id)
        
        if not include_templates:
            query = query.eq("is_template", False)
            
        # Filter by user_id if provided (for RLS)
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return response.data
    
    async def create(self, task_data: TaskCreate, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Create a new Task in the database"""
        # Convert to dict for Supabase
        data = task_data.model_dump()
        
        # Add user ID if provided
        if user_id:
            data["user_id"] = user_id
            
        # Ensure built-in tasks are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
        
        # Insert into Supabase
        response = self.supabase.table(self.table).insert(data).execute()
        
        if not response.data:
            logger.error("Failed to create task")
            raise Exception("Failed to create task")
            
        return response.data[0]
    
    async def update(self, task_id: int, task_data: TaskUpdate, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Update an existing Task in the database"""
        # Get the current task to check if it's built-in
        current_task = await self.get_by_id(task_id, user_id)
        if not current_task:
            raise Exception(f"Task with ID {task_id} not found or you don't have permission to access it")
            
        # Only admins can update built-in tasks (this check should be in the router)
        if current_task.get("is_builtin", False):
            # Logic for admin check will be in the router
            pass
            
        # Convert to dict for Supabase
        data = task_data.model_dump(exclude_unset=True)
        
        # Ensure built-in tasks are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
            
        # Update in Supabase
        query = self.supabase.table(self.table).update(data, count="exact").eq("id", task_id)
        
        # Add user_id filter for RLS compliance
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            logger.error(f"Failed to update task with ID {task_id}")
            raise Exception(f"Failed to update task with ID {task_id} or you don't have permission to update it")
            
        return response.data[0]
    
    async def delete(self, task_id: int, user_id: Optional[str] = None) -> bool:
        """Delete a Task from the database"""
        # Get the current task to check if it's built-in
        current_task = await self.get_by_id(task_id, user_id)
        if not current_task:
            raise Exception(f"Task with ID {task_id} not found or you don't have permission to access it")
            
        # Only admins can delete built-in tasks (this check should be in the router)
        if current_task.get("is_builtin", False):
            # Logic for admin check will be in the router
            pass
            
        # Delete from Supabase
        query = self.supabase.table(self.table).delete().eq("id", task_id)
        
        # Add user_id filter for RLS compliance
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        return len(response.data) > 0
