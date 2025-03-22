from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.models.crew import Crew, CrewCreate, CrewUpdate
from app.models.user import User
from app.repositories.crew_repository import CrewRepository
from app.core.dependencies import supabase_client, get_current_user

router = APIRouter(prefix="/api/crews", tags=["crews"])

# Create repository instance
crew_repository = CrewRepository(supabase_client=supabase_client)

@router.get("/", response_model=List[Crew])
async def get_all_crews(
    include_templates: bool = False,
    current_user: User = Depends(get_current_user),
):
    """Get all crews for the current user"""
    try:
        crews = crew_repository.get_crews(include_templates, current_user.id)
        return crews
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/templates", response_model=List[Crew])
async def get_templates(
    current_user: User = Depends(get_current_user),
):
    """Get all crew templates for the current user"""
    try:
        crews = crew_repository.get_crews_templates(current_user.id)
        return crews
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{crew_id}", response_model=Crew)
async def get_crew(
    crew_id: int,
    current_user: User = Depends(get_current_user),
):
    print("Current user:", current_user)
    print("Crew ID:", crew_id)
    """Get a specific crew"""
    try:
        crew = crew_repository.get_by_id(crew_id)
        if not crew:
            raise HTTPException(status_code=404, detail="Crew not found")
        if current_user.id != crew.user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        return crew
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/", response_model=Crew)
async def create_crew(
    crew: CrewCreate,
    current_user: User = Depends(get_current_user),
):
    """Create a new crew"""
    try:
        crew_dict = crew.model_dump()
        crew_dict["user_id"] = current_user.id
        new_crew = crew_repository.create(crew_dict)
        return new_crew
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/from-template/{template_id}", response_model=Crew)
async def create_crew_from_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
):
    """Create a new crew from a template"""
    try:
        crew = crew_repository.create_from_template(template_id, current_user.id)
        return crew
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{crew_id}", response_model=Crew)
async def update_crew(
    crew_id: int,
    crew: CrewUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update an existing crew"""
    try:
        crew_dict = crew.model_dump()
        updated_crew = crew_repository.update(crew_id, crew_dict)
        if not updated_crew:
            raise HTTPException(status_code=404, detail="Crew not found")
        if current_user.id != updated_crew.user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        return updated_crew
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{crew_id}")
async def delete_crew(
    crew_id: int,
    current_user: User = Depends(get_current_user),
):
    """Delete a crew"""
    try:
        crew = crew_repository.get_by_id(crew_id)
        if not crew:
            raise HTTPException(status_code=404, detail="Crew not found")
        if current_user.id != crew.user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        crew_repository.delete(crew_id)
        return {"message": "Crew deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
