"""Router for Crew endpoints"""
from typing import List, Optional
from fastapi import Depends, HTTPException, Body
from app.models.crew import Crew, CrewCreate, CrewUpdate
from app.models.agent import Agent, AgentCreate
from app.models.task import Task, TaskCreate
from app.models.crew_relations import CrewAgent, CrewTask
from app.repositories.crew_repository import CrewRepository
from app.repositories.agent_repository import AgentRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.crew_relations_repository import CrewAgentRepository, CrewTaskRepository
from app.core.dependencies import get_current_user, get_supabase_client
from .base_router import TemplateRouter


class CrewRouter(TemplateRouter[Crew, CrewCreate, CrewUpdate]):
    """Router for Crew endpoints"""
    
    def __init__(self):
        """Initialize the Crew router"""
        super().__init__(
            prefix="/crews",
            repository_class=CrewRepository,
            response_model=Crew,
            create_schema=CrewCreate,
            update_schema=CrewUpdate,
            tags=["Crews"]
        )
        
        # Register additional routes
        self._register_additional_routes()
    
    def _register_additional_routes(self):
        """Register additional Crew-specific routes"""
        
        @self.router.post("/{crew_id}/agents", response_model=CrewAgent)
        async def add_agent_to_crew(
            crew_id: int,
            agent_template_id: Optional[int] = None,
            agent_data: Optional[AgentCreate] = Body(None),
            role: str = Body(...),
            agent_order: int = Body(...),
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            try:
                """Add an agent to a crew, either from a template or new data"""
                crew_repo = CrewRepository(supabase_client)
                agent_repo = AgentRepository(supabase_client)
                crew_agent_repo = CrewAgentRepository(supabase_client)
            
                # Verify crew exists and user has access
                crew = await crew_repo.get_by_id(crew_id, user_id=user.id)
                if not crew:
                    raise HTTPException(status_code=404, detail="Crew not found")
            
                # Create agent from template or data
                if agent_template_id:
                    # Get template
                    template = await agent_repo.get_by_id(agent_template_id, user_id=user.id)
                    if not template or not template.is_template:
                        raise HTTPException(status_code=400, detail="Agent template not found")
                    
                    # Create from template
                    agent_dict = template.model_dump(exclude={
                        "id", "created_at", "updated_at", "is_template",
                        "is_builtin", "template_id", "template_version"
                    })
                    agent_dict["template_id"] = agent_template_id
                    agent_dict["template_version"] = template.template_version or 1
                    agent = await agent_repo.create(
                        AgentCreate.model_validate(agent_dict),
                        user_id=user.id
                    )
                elif agent_data:
                    # Create from provided data
                    agent_data.is_template = False
                    agent_data.is_builtin = False
                    agent = await agent_repo.create(agent_data, user_id=user.id)
                else:
                    raise HTTPException(
                        status_code=400,
                        detail="Either agent_template_id or agent_data must be provided"
                    )
                
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

            # Add agent to crew
            try:
                return await crew_agent_repo.create(
                    CrewAgent(
                        crew_id=crew_id,
                        agent_id=agent.id,
                        role=role,
                        agent_order=agent_order
                    ),
                    user_id=user.id
                )
            except Exception as e:
                # Cleanup agent if crew assignment fails
                await agent_repo.delete(agent.id, user_id=user.id)
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.router.post("/{crew_id}/tasks", response_model=CrewTask)
        async def add_task_to_crew(
            crew_id: int,
            task_template_id: Optional[int] = None,
            task_data: Optional[TaskCreate] = Body(None),
            task_order: int = Body(...),
            assigned_agent_id: Optional[int] = Body(None),
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Add a task to a crew, either from a template or new data"""
            crew_repo = CrewRepository(supabase_client)
            task_repo = TaskRepository(supabase_client)
            crew_task_repo = CrewTaskRepository(supabase_client)
            crew_agent_repo = CrewAgentRepository(supabase_client)
            
            try:
                # Verify crew exists and user has access
                crew = await crew_repo.get_by_id(crew_id, user_id=user.id)
                if not crew:
                    raise HTTPException(status_code=404, detail="Crew not found")
                
                # Verify assigned agent is in crew if provided
                if assigned_agent_id:
                    crew_agents = await crew_agent_repo.get_by_crew(crew_id, user_id=user.id)
                    if not any(ca.agent_id == assigned_agent_id for ca in crew_agents):
                        raise HTTPException(
                            status_code=400,
                            detail="Assigned agent must be a member of the crew"
                    )
            
                # Create task from template or data
                if task_template_id:
                    # Get template
                    template = await task_repo.get_by_id(task_template_id, user_id=user.id)
                    if not template or not template.is_template:
                        raise HTTPException(status_code=400, detail="Task template not found")
                    
                    # Create from template
                    task_dict = template.model_dump(exclude={
                        "id", "created_at", "updated_at", "is_template",
                        "is_builtin", "template_id", "template_version", "agent"
                    })
                    task_dict["template_id"] = task_template_id
                    task_dict["template_version"] = template.template_version or 1
                    task_dict["agent"] = assigned_agent_id
                    task = await task_repo.create(
                        TaskCreate.model_validate(task_dict),
                        user_id=user.id
                    )
                elif task_data:
                    # Create from provided data
                    task_data.is_template = False
                    task_data.is_builtin = False
                    task_data.agent = assigned_agent_id
                    task = await task_repo.create(task_data, user_id=user.id)
                else:
                    raise HTTPException(
                        status_code=400,
                        detail="Either task_template_id or task_data must be provided"
                    )
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
            # Add task to crew
            try:
                return await crew_task_repo.create(
                    CrewTask(
                        crew_id=crew_id,
                        task_id=task.id,
                        task_order=task_order,
                        assigned_agent_id=assigned_agent_id
                    ),
                    user_id=user.id
                )
            except Exception as e:
                # Cleanup task if crew assignment fails
                await task_repo.delete(task.id, user_id=user.id)
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.router.delete("/{crew_id}/agents/{agent_id}")
        async def remove_agent_from_crew(
            crew_id: int,
            agent_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            try:
                """Remove an agent from a crew"""
                crew_agent_repo = CrewAgentRepository(supabase_client)
                
                success = await crew_agent_repo.delete(
                    crew_id=crew_id,
                    agent_id=agent_id,
                    user_id=user.id
                    )
            
                if not success:
                    raise HTTPException(
                        status_code=404,
                        detail="Agent not found in crew"
                    )
                
                return {"status": "success"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.router.delete("/{crew_id}/tasks/{task_id}")
        async def remove_task_from_crew(
            crew_id: int,
            task_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            try:
                """Remove a task from a crew"""
                crew_task_repo = CrewTaskRepository(supabase_client)
                
                success = await crew_task_repo.delete(
                    crew_id=crew_id,
                    task_id=task_id,
                    user_id=user.id
                )
            
                if not success:
                    raise HTTPException(
                        status_code=404,
                        detail="Task not found in crew"
                    )
            
                return {"status": "success"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
