from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Dict, Any, Optional
from app.models.task import Task, TaskCreate, TaskUpdate
from app.repositories.task_repository import TaskRepository
from app.core.dependencies import supabase, security
from fastapi.security import HTTPAuthorizationCredentials
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# Create repository instance
task_repository = TaskRepository(supabase)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_tasks(
    include_templates: bool = True,
    agent_id: Optional[int] = Query(None, description="Filter tasks by agent ID"),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all Tasks, optionally filtered by agent ID"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        if agent_id:
            tasks = await task_repository.get_by_agent(agent_id, include_templates=include_templates, user_id=user_id)
            logger.info(f"Retrieved {len(tasks)} tasks for agent {agent_id} and user {user_id}")
        else:
            tasks = await task_repository.get_all(include_templates=include_templates, user_id=user_id)
            logger.info(f"Retrieved {len(tasks)} tasks for user {user_id}")
            
        return tasks
    except Exception as e:
        logger.error(f"Error retrieving tasks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.get("/templates", response_model=List[Dict[str, Any]])
async def get_templates(
    include_builtin: bool = True,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all template Tasks"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get templates with user_id filter for RLS
        templates = await task_repository.get_templates(include_builtin=include_builtin, user_id=user_id)
        logger.info(f"Retrieved {len(templates)} task templates for user {user_id}")
        return templates
    except Exception as e:
        logger.error(f"Error retrieving task templates: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )


@router.get("/{task_id}", response_model=Dict[str, Any])
async def get_task(
    task_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get a Task by ID"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get task with user_id filter for RLS
        task = await task_repository.get_by_id(task_id, user_id=user_id)
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found or you don't have permission to access it"
            )
            
        logger.info(f"Retrieved task with ID {task_id} for user {user_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving task with ID {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving task: {str(e)}"
        )


@router.post("/", response_model=Dict[str, Any])
async def create_task(
    task_data: TaskCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new Task"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Check if trying to create a built-in task (only admins can do this)
        if task_data.is_builtin:
            # TODO: Add admin check here
            # For now, we'll just allow it for development
            pass
        
        # Create task with user_id for RLS
        task = await task_repository.create(task_data, user_id=user_id)
        logger.info(f"Created new task with ID {task['id']} for user {user_id}")
        return task
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating task: {str(e)}"
        )


@router.put("/{task_id}", response_model=Dict[str, Any])
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update an existing Task"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get the current task to check permissions
        current_task = await task_repository.get_by_id(task_id, user_id=user_id)
        
        if not current_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found or you don't have permission to access it"
            )
            
        # Check if trying to update a built-in task (only admins can do this)
        if current_task.get("is_builtin", False) or task_data.is_builtin:
            # TODO: Add admin check here
            # For now, we'll just allow it for development
            pass
            
        # Update task with user_id for RLS
        updated_task = await task_repository.update(task_id, task_data, user_id=user_id)
        
        logger.info(f"Updated task with ID {task_id} for user {user_id}")
        return updated_task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating task with ID {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task: {str(e)}"
        )


@router.delete("/{task_id}", response_model=Dict[str, Any])
async def delete_task(
    task_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Delete a Task"""
    try:
        # Verify the JWT token
        user = supabase.auth.get_user(credentials.credentials)
        user_id = user.user.id
        
        # Get the current task to check permissions
        current_task = await task_repository.get_by_id(task_id, user_id=user_id)
        
        if not current_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found or you don't have permission to access it"
            )
            
        # Check if trying to delete a built-in task (only admins can do this)
        if current_task.get("is_builtin", False):
            # TODO: Add admin check here
            # For now, we'll just allow it for development
            pass
            
        # Delete task with user_id for RLS
        success = await task_repository.delete(task_id, user_id=user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting task with ID {task_id}"
            )
            
        logger.info(f"Deleted task with ID {task_id} for user {user_id}")
        return {"message": f"Task with ID {task_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting task with ID {task_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting task: {str(e)}"
        )
