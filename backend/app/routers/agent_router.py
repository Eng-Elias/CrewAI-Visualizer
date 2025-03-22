"""Router for Agent endpoints"""
from typing import List
from fastapi import Depends
from app.models.agent import Agent, AgentCreate, AgentUpdate
from app.repositories.agent_repository import AgentRepository
from app.repositories.crew_relations_repository import CrewAgentRepository
from app.core.dependencies import get_current_user, get_supabase_client
from .base_router import BaseRouter


class AgentRouter(BaseRouter[Agent, AgentCreate, AgentUpdate]):
    """Router for Agent endpoints"""
    
    def __init__(self):
        """Initialize the Agent router"""
        super().__init__(
            prefix="/agents",
            repository_class=AgentRepository,
            response_model=Agent,
            create_schema=AgentCreate,
            update_schema=AgentUpdate,
            tags=["Agents"]
        )
        
        # Register additional routes
        self._register_additional_routes()
    
    def _register_additional_routes(self):
        """Register additional Agent-specific routes"""
        
        @self.router.get("/by-crew/{crew_id}", response_model=List[Agent])
        async def get_by_crew(
            crew_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all agents in a specific crew"""
            crew_agent_repo = CrewAgentRepository(supabase_client)
            agent_repo = AgentRepository(supabase_client)
            
            # Get crew-agent relationships
            crew_agents = await crew_agent_repo.get_by_crew(crew_id, user_id=user["id"])
            
            # Get full agent details
            agents = []
            for crew_agent in crew_agents:
                agent = await agent_repo.get_by_id(crew_agent.agent_id, user_id=user["id"])
                if agent:
                    agents.append(agent)
            
            return agents
