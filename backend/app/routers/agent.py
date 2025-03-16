from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
from app.models.agent import Agent, AgentCreate, AgentUpdate
from app.repositories.agent_repository import AgentRepository
from app.core.dependencies import supabase, security
from fastapi.security import HTTPAuthorizationCredentials
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/agents", tags=["agents"])

# Create repository instance
agent_repository = AgentRepository(supabase)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_agents(
    include_templates: bool = True,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all Agents"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get agents with user_id filter for RLS
        agents = await agent_repository.get_all(include_templates=include_templates, user_id=user_id)
        logger.info(f"Retrieved {len(agents)} agents for user {user_id}")
        return agents
    except Exception as e:
        logger.error(f"Error retrieving agents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.get("/templates", response_model=List[Dict[str, Any]])
async def get_templates(
    include_builtin: bool = True,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all template Agents"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get templates with user_id filter for RLS
        templates = await agent_repository.get_templates(include_builtin=include_builtin, user_id=user_id)
        logger.info(f"Retrieved {len(templates)} agent templates for user {user_id}")
        return templates
    except Exception as e:
        logger.error(f"Error retrieving agent templates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.get("/{agent_id}", response_model=Dict[str, Any])
async def get_agent(
    agent_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get an Agent by ID"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get agent with user_id filter for RLS
        agent = await agent_repository.get_by_id(agent_id, user_id=user_id)
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID {agent_id} not found or you don't have permission to access it"
            )
            
        logger.info(f"Retrieved agent with ID {agent_id} for user {user_id}")
        return agent
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving agent with ID {agent_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving agent: {str(e)}"
        )


@router.post("/", response_model=Dict[str, Any])
async def create_agent(
    agent_data: AgentCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    logger.info(f"Creating new agent: {agent_data}")
    """Create a new Agent"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Check if trying to create a built-in agent (only admins can do this)
        if agent_data.is_builtin:
            # TODO: Add admin check here
            # For now, we'll just allow it for development
            pass

        # Create agent with user_id for RLS
        agent = await agent_repository.create(agent_data, user_id=user_id)

        logger.info(f"Created new agent with ID {agent['id']} for user {user_id}")
        return agent
    except Exception as e:
        logger.error(f"Error creating agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating agent: {str(e)}"
        )


@router.put("/{agent_id}", response_model=Dict[str, Any])
async def update_agent(
    agent_id: int,
    agent_data: AgentUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    logger.info(f"Updating agent with ID {agent_id}: {agent_data}")
    """Update an existing Agent"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get the current agent to check permissions
        current_agent = await agent_repository.get_by_id(agent_id, user_id=user_id)
        print("current_agent", current_agent)
        
        if not current_agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID {agent_id} not found or you don't have permission to access it"
            )
            
        # Check if trying to update a built-in agent (only admins can do this)
        if current_agent.get("is_builtin", False) or agent_data.is_builtin:
            # TODO: Add admin check here
            # For now, we'll just allow it for development
            pass
            
        # Update agent with user_id for RLS
        updated_agent = await agent_repository.update(agent_id, agent_data, user_id=user_id)
        print("updated_agent", updated_agent)

        logger.info(f"Updated agent with ID {agent_id} for user {user_id}")
        return updated_agent
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating agent with ID {agent_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating agent: {str(e)}"
        )


@router.delete("/{agent_id}", response_model=Dict[str, Any])
async def delete_agent(
    agent_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Delete an Agent"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get the current agent to check permissions
        current_agent = await agent_repository.get_by_id(agent_id, user_id=user_id)
        
        if not current_agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID {agent_id} not found or you don't have permission to access it"
            )
            
        # Check if trying to delete a built-in agent (only admins can do this)
        if current_agent.get("is_builtin", False):
            # TODO: Add admin check here
            # For now, we'll just allow it for development
            pass
            
        # Delete agent with user_id for RLS
        success = await agent_repository.delete(agent_id, user_id=user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting agent with ID {agent_id}"
            )
            
        logger.info(f"Deleted agent with ID {agent_id} for user {user_id}")
        return {"message": f"Agent with ID {agent_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting agent with ID {agent_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting agent: {str(e)}"
        )
