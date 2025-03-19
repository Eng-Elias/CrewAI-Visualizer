from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
from app.models.crew import Crew, CrewCreate, CrewUpdate
from app.repositories.crew_repository import CrewRepository
from app.core.dependencies import supabase as supabase_client, security
from fastapi.security import HTTPAuthorizationCredentials
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/crews", tags=["crews"])

# Create repository instance
crew_repository = CrewRepository()


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_crews(
    include_templates: bool = True,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all crews for the authenticated user"""
    try:
        supabase = supabase_client
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        crews = await crew_repository.get_crews(include_templates=include_templates, user_id=user_id)
        logger.info(f"Retrieved {len(crews)} crews for user {user_id}")
        return crews
    except Exception as e:
        logger.error(f"Error retrieving crews: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving crews: {str(e)}"
        )


@router.get("/templates", response_model=List[Dict[str, Any]])
async def get_templates(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all crew templates for the authenticated user"""
    try:
        supabase = supabase_client
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        templates = crew_repository.get_crews_templates(user_id=user_id)
        logger.info(f"Retrieved {len(templates)} crew templates for user {user_id}")
        # Convert Crew objects to dictionaries
        templates_dict = [template.dict() for template in templates]
        return templates_dict
    except Exception as e:
        logger.error(f"Error retrieving crew templates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving crew templates: {str(e)}"
        )


@router.get("/{crew_id}", response_model=Crew)
async def get_crew(
    crew_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get a specific crew by ID"""
    try:
        supabase = supabase_client
        user = supabase.auth.get_user(credentials.credentials)

        crew = crew_repository.get_by_id(crew_id)
        if not crew:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crew not found")

        if user.user.id != crew.user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
        return crew
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving crew {crew_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving crew: {str(e)}"
        )


@router.post("/", response_model=Dict[str, Any])
async def create_crew(
    crew_data: CrewCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new crew"""
    try:
        supabase = supabase_client
        user = supabase.auth.get_user(credentials.credentials)
        crew_data.user_id = user.user.id
        
        created_crew = await crew_repository.create(crew_data)
        logger.info(f"Created crew {created_crew['id']} for user {user.user.id}")
        return created_crew
    except Exception as e:
        logger.error(f"Error creating crew: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating crew: {str(e)}"
        )


@router.put("/{crew_id}", response_model=Dict[str, Any])
async def update_crew(
    crew_id: int,
    crew_data: CrewUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update an existing crew"""
    try:
        supabase = supabase_client
        user = supabase.auth.get_user(credentials.credentials)
        updated_crew = await crew_repository.update(crew_id, crew_data)
        if not updated_crew:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crew not found")
        if user.user.id != updated_crew.user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
        logger.info(f"Updated crew {crew_id}")
        return updated_crew
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating crew {crew_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating crew: {str(e)}"
        )


@router.delete("/{crew_id}", response_model=Dict[str, Any])
async def delete_crew(
    crew_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Delete a crew by ID"""
    try:
        supabase = supabase_client
        user = supabase.auth.get_user(credentials.credentials)
        crew = await crew_repository.get_by_id(crew_id)
        if not crew:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crew not found")
        if user.user.id != crew.user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
        if await crew_repository.delete(crew_id):
            logger.info(f"Deleted crew {crew_id}")
            return {"message": "Crew deleted successfully"}
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crew not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting crew {crew_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting crew: {str(e)}"
        )
