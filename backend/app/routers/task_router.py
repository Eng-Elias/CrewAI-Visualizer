"""Router for Task endpoints"""
from typing import List
from fastapi import Depends, HTTPException
from app.models.task import Task, TaskCreate, TaskUpdate
from app.repositories.task_repository import TaskRepository
from app.repositories.crew_relations_repository import CrewTaskRepository
from app.core.dependencies import get_current_user, get_supabase_client
from .base_router import TemplateRouter


class TaskRouter(TemplateRouter[Task, TaskCreate, TaskUpdate]):
    """Router for Task endpoints"""
    
    def __init__(self):
        """Initialize the Task router"""
        super().__init__(
            prefix="/tasks",
            repository_class=TaskRepository,
            response_model=Task,
            create_schema=TaskCreate,
            update_schema=TaskUpdate,
            tags=["Tasks"]
        )
        
        # Register additional routes
        self._register_additional_routes()
    
    def _register_additional_routes(self):
        """Register additional Task-specific routes"""
        
        @self.router.get("/by-crew/{crew_id}", response_model=List[Task])
        async def get_by_crew(
            crew_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all tasks in a specific crew"""
            crew_task_repo = CrewTaskRepository(supabase_client)
            task_repo = TaskRepository(supabase_client)
            
            # Get crew-task relationships
            crew_tasks = await crew_task_repo.get_by_crew(crew_id, user_id=user.id)
            
            # Get full task details
            tasks = []
            for crew_task in crew_tasks:
                task = await task_repo.get_by_id(crew_task.task_id, user_id=user.id)
                if task:
                    # Set the assigned agent
                    task.agent = crew_task.assigned_agent_id
                    tasks.append(task)
            
            return tasks
        
        @self.router.get("/by-agent/{agent_id}", response_model=List[Task])
        async def get_by_agent(
            agent_id: int,
            include_templates: bool = False,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all tasks assigned to a specific agent"""
            task_repo = TaskRepository(supabase_client)
            return await task_repo.get_by_agent(
                agent_id,
                include_templates=include_templates,
                user_id=user.id
            )
        
        @self.router.get("/by-context/{context_id}", response_model=List[Task])
        async def get_by_context(
            context_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all tasks that reference a specific context"""
            task_repo = TaskRepository(supabase_client)
            return await task_repo.get_by_context(context_id, user_id=user.id)
