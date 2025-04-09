"""Repository for managing Tasks in Supabase"""
from typing import Dict, List, Optional, Any
from app.models.task import Task, TaskCreate, TaskUpdate
from .base_repository import BaseRepository
from .consts import TableNameEnum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TaskRepository(BaseRepository[Task, TaskCreate, TaskUpdate]):
    """Repository for managing Tasks in Supabase"""
    
    def __init__(self, supabase_client):
        """Initialize the repository with Supabase client"""
        super().__init__(supabase_client, TableNameEnum.TASKS.value, Task)
    
    async def get_all(
        self,
        include_templates: bool = True,
        user_id: Optional[str] = None
    ) -> List[Task]:
        """Get all Tasks from the database
        
        Args:
            include_templates: If True, include template tasks in the results
            user_id: Filter tasks by user_id for RLS compliance
        """
        filters = None
        if not include_templates:
            filters = {"is_template": False}
        
        return await super().get_all(filters=filters, user_id=user_id)
    
    async def get_templates(
        self,
        include_builtin: bool = True,
        user_id: Optional[str] = None
    ) -> List[Task]:
        """Get all template Tasks from the database"""
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
        
        return await self.get_all(filters=filters)
    
    async def get_by_id(
        self,
        task_id: int,
        user_id: Optional[str] = None
    ) -> Optional[Task]:
        """Get a Task by its ID
        
        Args:
            task_id: The ID of the task to retrieve
            user_id: Filter by user_id for RLS compliance
        """
        return await super().get_by_id(task_id, user_id=user_id)
    
    async def get_by_agent(
        self,
        agent_id: int,
        include_templates: bool = False,
        user_id: Optional[str] = None
    ) -> List[Task]:
        """Get all Tasks for a specific Agent
        
        Args:
            agent_id: The ID of the agent to get tasks for
            include_templates: If True, include template tasks in the results
            user_id: Filter tasks by user_id for RLS compliance
        """
        filters = {"agent": agent_id}
        if not include_templates:
            filters["is_template"] = False
        
        return await self.get_all(filters=filters, user_id=user_id)
    
    async def get_by_context(
        self,
        context_id: int,
        user_id: Optional[str] = None
    ) -> List[Task]:
        """Get all tasks that reference a specific context"""
        query = self.supabase.table(self.table)\
            .select("*")\
            .contains("context", [context_id])
            
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return [self.model.model_validate(item) for item in response.data]
    
    async def create(
        self,
        task_data: TaskCreate,
        user_id: Optional[str] = None
    ) -> Task:
        """Create a new Task in the database"""
        data = await self._pre_create(task_data.model_dump())
        
        if user_id:
            data["user_id"] = user_id
            
        return await super().create(data, user_id=user_id)
    
    async def update(
        self,
        task_id: int,
        task_data: TaskUpdate,
        user_id: Optional[str] = None
    ) -> Task:
        """Update an existing Task in the database"""
        current_task = await self.get_by_id(task_id, user_id)
        if not current_task:
            raise Exception(f"Task with ID {task_id} not found or you don't have permission to access it")
        
        data = await self._pre_update(current_task, task_data.model_dump(exclude_unset=True))
        
        return await super().update(task_id, data, user_id=user_id)
    
    async def delete(
        self,
        task_id: int,
        user_id: Optional[str] = None
    ) -> bool:
        """Delete a Task from the database"""
        current_task = await self.get_by_id(task_id, user_id)
        if not current_task:
            raise Exception(f"Task with ID {task_id} not found or you don't have permission to access it")
        
        if current_task.is_builtin:
            raise Exception("Cannot delete built-in tasks")
        
        return await super().delete(task_id, user_id=user_id)
    
    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation"""
        # Ensure built-in tasks are also templates
        if data.get("is_builtin", False):
            data["is_template"] = True
        return data
    
    async def _pre_update(
        self,
        current_item: Task,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Pre-process data before update"""
        # Prevent modification of built-in tasks
        if current_item.is_builtin:
            raise Exception("Cannot modify built-in tasks")
            
        # Ensure built-in tasks are also templates
        if update_data.get("is_builtin", False):
            update_data["is_template"] = True
            
        return update_data
