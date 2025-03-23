"""Service for managing CrewAI operations"""
from typing import Dict, List, Optional, Any
from textwrap import dedent
from crewai import Agent, Task, Crew, Process
from app.models.mission import Mission, MissionCreate, MissionData
from app.models.llm import LLMProvider
from app.repositories.crew_repository import CrewRepository
from app.repositories.mission_repository import MissionRepository
from app.repositories.llm_repository import LLMRepository
from app.utils.llm_utils import get_llm_from_config
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CrewAIService:
    """Service for managing CrewAI operations"""
    
    def __init__(
        self,
        crew_repository: CrewRepository,
        mission_repository: MissionRepository,
        llm_repository: LLMRepository
    ):
        """Initialize the service with repositories"""
        self.crew_repository = crew_repository
        self.mission_repository = mission_repository
        self.llm_repository = llm_repository
    
    async def _get_llm_instance(self, llm_id: int, model: str) -> Any:
        """Get LLM instance from config"""
        if not llm_id:
            return None
            
        llm_config = await self.llm_repository.get_by_id(llm_id)
        if not llm_config:
            return None
            
        return get_llm_from_config(
            provider=LLMProvider(llm_config["provider"]),
            model=model,
            api_key=llm_config["api_key"]
        )
    
    def _create_agent(self, agent_config: Dict[str, Any], llm: Any) -> Agent:
        """Create a CrewAI agent from configuration"""
        try:
            return Agent(
                role=agent_config["role"],
                goal=agent_config["goal"],
                backstory=agent_config["backstory"],
                allow_delegation=agent_config.get("allow_delegation", True),
                verbose=agent_config.get("verbose", True),
                llm=llm,
                memory=agent_config.get("memory", False),
            )
        except Exception as e:
            logger.error(f"Failed to create agent {agent_config['role']}: {str(e)}")
            raise
    
    def _create_task(
        self,
        task_config: Dict[str, Any],
        agents: List[Agent]
    ) -> Task:
        """Create a CrewAI task from configuration"""
        try:
            assigned_agent = None
            if task_config.get("assigned_agent_id"):
                assigned_agent = next(
                    (a for a in agents if a.role == task_config["assigned_agent_role"]),
                    None
                )
            
            return Task(
                description=dedent(task_config["description"]),
                agent=assigned_agent,
                expected_output=task_config["expected_output"],
            )
        except Exception as e:
            logger.error(f"Failed to create task: {str(e)}")
            raise
    
    async def create_mission(
        self,
        crew_id: int,
        name: str,
        description: Optional[str] = None,
        input_data: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Mission:
        """Create a new mission"""
        try:
            # Get crew data for LLM defaults
            crew = await self.crew_repository.get_by_id(crew_id, user_id)
            if not crew:
                raise ValueError(f"Crew {crew_id} not found")
            
            # Create mission with LLM configuration
            mission_create = MissionCreate(
                crew_id=crew_id,
                name=name,
                description=description,
                input_data=MissionData(text=input_data or ""),
                default_llm_id=crew["default_llm_id"],
                default_llm_model=crew["default_llm_model"],
                manager_llm_id=crew["manager_llm_id"],
                manager_llm_model=crew["manager_llm_model"],
                function_calling_llm_id=crew["function_calling_llm_id"],
                function_calling_llm_model=crew["function_calling_llm_model"],
                planning_llm_id=crew["planning_llm_id"],
                planning_llm_model=crew["planning_llm_model"]
            )
            return await self.mission_repository.create(mission_create, user_id)
        except Exception as e:
            logger.error(f"Failed to create mission: {str(e)}")
            raise
    
    async def execute_mission(
        self,
        mission_id: int,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute a CrewAI mission"""
        try:
            # Get mission data
            mission = await self.mission_repository.get_by_id(
                mission_id,
                user_id=user_id
            )
            if not mission:
                raise ValueError(f"Mission {mission_id} not found")
            
            # Get crew data
            crew_data = await self.crew_repository.get_by_id(
                mission.crew_id,
                user_id=user_id
            )
            if not crew_data:
                raise ValueError(f"Crew {mission.crew_id} not found")
            
            # Get LLM instances
            default_llm = await self._get_llm_instance(
                mission.default_llm_id,
                mission.default_llm_model
            )
            if not default_llm:
                raise ValueError("Default LLM not configured")
                
            manager_llm = await self._get_llm_instance(
                mission.manager_llm_id,
                mission.manager_llm_model
            )
            function_calling_llm = await self._get_llm_instance(
                mission.function_calling_llm_id,
                mission.function_calling_llm_model
            )
            planning_llm = await self._get_llm_instance(
                mission.planning_llm_id,
                mission.planning_llm_model
            )
            
            # Create agents with default LLM
            agents = [
                self._create_agent(agent, default_llm)
                for agent in crew_data["agents"]
            ]
            
            # Create tasks
            tasks = [
                self._create_task(task, agents)
                for task in crew_data["tasks"]
            ]
            
            # Update mission status
            await self.mission_repository.update_status(
                mission_id,
                "running",
                user_id=user_id
            )
            
            # Create and run crew
            crew = Crew(
                agents=agents,
                tasks=tasks,
                verbose=crew_data["verbose"],
                process=Process[crew_data["process"].upper()],
                manager_llm=manager_llm or default_llm,
                function_calling_llm=function_calling_llm,
                planning_llm=planning_llm
            )
            
            # Execute mission with input data
            result = crew.kickoff(mission.input_data.text)
            
            # Update mission with result
            await self.mission_repository.update_status(
                mission_id,
                "completed",
                result_data={"text": result},
                user_id=user_id
            )
            
            return {
                "success": True,
                "result": result
            }
            
        except Exception as e:
            logger.error(f"Failed to execute mission: {str(e)}")
            # Update mission with error
            if mission_id:
                await self.mission_repository.update_status(
                    mission_id,
                    "failed",
                    error=str(e),
                    user_id=user_id
                )
            return {
                "success": False,
                "error": str(e)
            }