from typing import List, Optional
from postgrest.exceptions import APIError
from app.models.crew import Crew
from app.core.dependencies import supabase as supabase_client
import logging


logger = logging.getLogger(__name__)

class CrewRepository:

    CREW_AGENTS_SUPABASE_QUERY = """
        crew_agents:crew_agents(
            id,
            agent_id,
            role,
            data:agent_id(
                id,
                created_at,
                updated_at,
                name,
                role,
                goal,
                backstory,
                memory_enabled,
                verbose,
                allow_delegation,
                max_iterations,
                max_rpm,
                llm_config,
                tools,
                user_id,
                is_template,
                is_builtin,
                template_id,
                template_version
            )
        )
    """

    CREW_TASKS_SUPABASE_QUERY = """
        crew_tasks:crew_tasks(
            id,
            task_id,
            assigned_agent_id,
            data:task_id(
                id,
                created_at,
                updated_at,
                name,
                description,
                expected_output,
                tools,
                async_execution,
                config,
                output_json,
                user_id,
                context,
                is_template,
                is_builtin,
                template_id,
                template_version
            )
        )
    """

    def __init__(self):
        self.supabase = supabase_client
        self.table = "Crews"

    def get_crews(self, include_templates: bool = False, user_id: str = None) -> List[Crew]:
        """Get all crews for a user, optionally including templates"""
        try:
            query = self.supabase.from_(self.table).select(f"""
                *,
                {self.CREW_AGENTS_SUPABASE_QUERY},
                {self.CREW_TASKS_SUPABASE_QUERY}
            """)

            # Filter out templates if not requested
            if not include_templates:
                query = query.eq("is_template", False)

            # Filter by user_id if provided, otherwise get all public crews
            if user_id:
                # Get user's own crews and public crews (is_builtin=true)
                query = query.or_(f"user_id.eq.{user_id},is_builtin.eq.true")

            response = query.execute()
            
            if response.data:
                return [Crew.model_validate(crew) for crew in response.data]
            return []
        except APIError as e:
            logger.error(f"Error getting crews: {str(e)}")
            raise
    
    def get_crews_templates(self, user_id: str) -> List[Crew]:
        """Get crew templates that are either built-in or owned by the user"""
        try:
            response = self.supabase.from_(self.table).select(f"""
                *,
                {self.CREW_AGENTS_SUPABASE_QUERY},
                {self.CREW_TASKS_SUPABASE_QUERY}
            """).eq("is_template", True).or_(
                f"is_builtin.eq.true,user_id.eq.{user_id}"
            ).execute()

            logger.info(f"Retrieved {len(response.data)} crew templates for user {user_id}")
            
            if response.data:
                return [Crew.model_validate(crew) for crew in response.data]
            return []
        except APIError as e:
            logger.error(f"Error getting crew templates: {str(e)}")
            raise

    def get_by_id(self, crew_id: int) -> Optional[Crew]:
        """Get a specific crew by ID"""
        try:
            response = self.supabase.from_(self.table).select(f"""
                *,
                {self.CREW_AGENTS_SUPABASE_QUERY},
                {self.CREW_TASKS_SUPABASE_QUERY}
            """).eq("id", crew_id).single().execute()
            
            if response.data:
                return Crew.model_validate(response.data)
            return None
        except APIError as e:
            logger.error(f"Error getting crew {crew_id}: {str(e)}")
            raise

    def create_crew(self, crew: dict) -> Crew:
        """Create a new crew"""
        try:
            response = self.supabase.from_(self.table).insert(crew).select(f"""
                *,
                {self.CREW_AGENTS_SUPABASE_QUERY},
                {self.CREW_TASKS_SUPABASE_QUERY}
            """).single().execute()
            
            if response.data:
                return Crew.model_validate(response.data)
            return None
        except APIError as e:
            logger.error(f"Error creating crew: {str(e)}")
            raise

    def update_crew(self, crew_id: int, crew: dict) -> Optional[Crew]:
        """Update an existing crew"""
        try:
            response = self.supabase.from_(self.table).update(crew).eq("id", crew_id).select(f"""
                *,
                {self.CREW_AGENTS_SUPABASE_QUERY},
                {self.CREW_TASKS_SUPABASE_QUERY}
            """).single().execute()
            
            if response.data:
                return Crew.model_validate(response.data)
            return None
        except APIError as e:
            logger.error(f"Error updating crew {crew_id}: {str(e)}")
            raise

    def delete_crew(self, crew_id: int) -> bool:
        """Delete a crew by ID"""
        try:
            response = self.supabase.from_(self.table).delete().eq("id", crew_id).execute()
            return bool(response.data)
        except APIError as e:
            logger.error(f"Error deleting crew {crew_id}: {str(e)}")
            raise
