from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from app.models.llm import LLM, LLMCreate, LLMUpdate, LLMProvider
from app.repositories.llm_repository import LLMRepository
from app.core.dependencies import supabase, security
from fastapi.security import HTTPAuthorizationCredentials
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/llms", tags=["llms"])

# Create repository instance
llm_repository = LLMRepository(supabase)


@router.get("/providers", response_model=Dict[str, str])
async def get_providers(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all available LLM providers"""
    try:
        # Verify the JWT token
        supabase.auth.get_user(credentials.credentials)
        providers = {provider.name: provider.value for provider in LLMProvider}
        logger.info(f"Retrieved providers: {providers}")
        return providers
    except Exception as e:
        logger.error(f"Error retrieving providers: {str(e)}")
        # For development, don't require authentication for providers
        return {provider.name: provider.value for provider in LLMProvider}


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_llms(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all LLMs"""
    try:
        # Verify the JWT token
        supabase.auth.get_user(credentials.credentials)
        llms = await llm_repository.get_all()
        logger.info(f"Retrieved {len(llms)} LLMs")
        return llms
    except Exception as e:
        logger.error(f"Error retrieving LLMs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.get("/{llm_id}", response_model=Dict[str, Any])
async def get_llm(
    llm_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get an LLM by ID"""
    try:
        # Verify the JWT token
        supabase.auth.get_user(credentials.credentials)
        
        llm = await llm_repository.get_by_id(llm_id)
        if not llm:
            logger.warning(f"LLM with ID {llm_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"LLM with ID {llm_id} not found"
            )
        logger.info(f"Retrieved LLM with ID {llm_id}")
        return llm
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving LLM with ID {llm_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_llm(
    llm_data: LLMCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new LLM"""
    try:
        # Verify the JWT token
        supabase.auth.get_user(credentials.credentials)
        
        created_llm = await llm_repository.create(llm_data)
        logger.info(f"Created new LLM: {llm_data.name}")
        return created_llm
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating LLM: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.put("/{llm_id}", response_model=Dict[str, Any])
async def update_llm(
    llm_id: int,
    llm_data: LLMUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update an existing LLM"""
    try:
        # Verify the JWT token
        supabase.auth.get_user(credentials.credentials)
        
        # Check if LLM exists
        llm = await llm_repository.get_by_id(llm_id)
        if not llm:
            logger.warning(f"LLM with ID {llm_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"LLM with ID {llm_id} not found"
            )
        
        updated_llm = await llm_repository.update(llm_id, llm_data)
        logger.info(f"Updated LLM with ID {llm_id}")
        return updated_llm
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating LLM with ID {llm_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update LLM: {str(e)}"
        )


@router.delete("/{llm_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_llm(
    llm_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Delete an LLM"""
    try:
        # Verify the JWT token
        supabase.auth.get_user(credentials.credentials)
        
        # Check if LLM exists
        llm = await llm_repository.get_by_id(llm_id)
        if not llm:
            logger.warning(f"LLM with ID {llm_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"LLM with ID {llm_id} not found"
            )
        
        success = await llm_repository.delete(llm_id)
        if not success:
            logger.error(f"Failed to delete LLM with ID {llm_id}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete LLM with ID {llm_id}"
            )
        logger.info(f"Deleted LLM with ID {llm_id}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting LLM with ID {llm_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete LLM: {str(e)}"
        )
