"""
Base repository class for all repositories.
Provides common CRUD operations and utility methods.
"""
from typing import TypeVar, Generic, Dict, List, Optional, Any, Type
from pydantic import BaseModel
from supabase import Client
import logging
from abc import ABC, abstractmethod

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Generic type variables
ModelType = TypeVar("ModelType", bound=BaseModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(ABC, Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Abstract base repository with common CRUD operations.
    
    Attributes:
        supabase: Supabase client instance
        table: Name of the table in Supabase
        model: Pydantic model class for the entity
    """
    
    def __init__(self, supabase_client: Client, table: str, model: Type[ModelType]):
        self.supabase = supabase_client
        self.table = table
        self.model = model
    
    async def get_all(
        self,
        select: str = "*",
        filters: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> List[ModelType]:
        """Get all items from the database with optional filters"""
        query = self.supabase.table(self.table).select(select)
        
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return [self.model.model_validate(item) for item in response.data]
    
    async def get_by_id(
        self,
        item_id: Any,
        select: str = "*",
        user_id: Optional[str] = None
    ) -> Optional[ModelType]:
        """Get an item by its ID"""
        query = self.supabase.table(self.table).select(select).eq("id", item_id)
        
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            return None
            
        return self.model.model_validate(response.data[0])
    
    async def create(
        self,
        data: CreateSchemaType,
        user_id: Optional[str] = None
    ) -> ModelType:
        """Create a new item in the database"""
        # Convert to dict and handle user_id
        create_data = data.model_dump()
        if user_id:
            create_data["user_id"] = user_id
            
        # Pre-process data if needed
        create_data = await self._pre_create(create_data)
        
        # Insert into Supabase
        response = self.supabase.table(self.table).insert(create_data).execute()
        
        if not response.data:
            logger.error(f"Failed to create item in {self.table}")
            raise Exception(f"Failed to create item in {self.table}")
            
        return self.model.model_validate(response.data[0])
    
    async def update(
        self,
        item_id: Any,
        data: UpdateSchemaType,
        user_id: Optional[str] = None
    ) -> ModelType:
        """Update an existing item in the database"""
        # Get current item if needed for validation
        current_item = await self.get_by_id(item_id, user_id=user_id)
        if not current_item:
            raise Exception(f"Item with id {item_id} not found")
            
        # Convert to dict and remove None values
        update_data = {
            k: v for k, v in data.model_dump(exclude_unset=True).items()
            if v is not None
        }
        
        # Pre-process update data if needed
        update_data = await self._pre_update(current_item, update_data)
        
        # Update in Supabase
        query = self.supabase.table(self.table).update(update_data).eq("id", item_id)
        
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            logger.error(f"Failed to update item in {self.table}")
            raise Exception(f"Failed to update item in {self.table}")
            
        return self.model.model_validate(response.data[0])
    
    async def delete(
        self,
        item_id: Any,
        user_id: Optional[str] = None
    ) -> bool:
        """Delete an item from the database"""
        query = self.supabase.table(self.table).delete().eq("id", item_id)
        
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        return bool(response.data)
    
    async def exists(
        self,
        item_id: Any,
        user_id: Optional[str] = None
    ) -> bool:
        """Check if an item exists in the database"""
        item = await self.get_by_id(item_id, select="id", user_id=user_id)
        return item is not None

    async def _pre_create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Pre-process data before creation. Override in derived classes if needed."""
        return data

    async def _pre_update(
        self,
        current_item: ModelType,
        update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Pre-process data before update. Override in derived classes if needed."""
        return update_data
