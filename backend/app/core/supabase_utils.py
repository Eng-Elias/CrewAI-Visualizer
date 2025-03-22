"""
Supabase utilities for backend operations.
Provides a centralized interface for all Supabase operations.
"""
from typing import Any, Dict, List, Optional, TypeVar
from supabase import Client, create_client
from functools import lru_cache
import os

T = TypeVar('T')

class SupabaseUtils:
    """Utility class for Supabase operations."""

    client: Client

    def __init__(self):
        """Initialize Supabase client."""
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL and key must be set in environment variables")
            
        self.client = create_client(supabase_url, supabase_key)
    
    @classmethod
    @lru_cache()
    def get_instance(cls) -> 'SupabaseUtils':
        """Get singleton instance of SupabaseUtils."""
        return cls()
    
    @property
    def auth(self):
        """Get Supabase auth client."""
        return self.client.auth
    
    def get_user(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get user information from access token."""
        try:
            return self.auth.get_user(access_token)
        except Exception as e:
            print(f"Error getting user: {e}")
            return None

    async def create_item(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new item in specified table."""
        try:
            response = await self.client.table(table).insert(data).execute()
            return response.data[0] if response.data else {}
        except Exception as e:
            print(f"Error creating item in {table}: {e}")
            raise

    async def get_items(
        self, 
        table: str, 
        filters: Optional[Dict[str, Any]] = None,
        select: str = "*"
    ) -> List[Dict[str, Any]]:
        """Get items from specified table with optional filters."""
        try:
            query = self.client.table(table).select(select)
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            response = await query.execute()
            return response.data
        except Exception as e:
            print(f"Error getting items from {table}: {e}")
            raise

    async def update_item(
        self, 
        table: str, 
        item_id: str, 
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an item in specified table."""
        try:
            response = await self.client.table(table)\
                .update(data)\
                .eq("id", item_id)\
                .execute()
            return response.data[0] if response.data else {}
        except Exception as e:
            print(f"Error updating item in {table}: {e}")
            raise

    async def delete_item(self, table: str, item_id: str) -> bool:
        """Delete an item from specified table."""
        try:
            await self.client.table(table)\
                .delete()\
                .eq("id", item_id)\
                .execute()
            return True
        except Exception as e:
            print(f"Error deleting item from {table}: {e}")
            raise

    async def upsert_items(
        self, 
        table: str, 
        items: List[Dict[str, Any]], 
        unique_columns: List[str]
    ) -> List[Dict[str, Any]]:
        """Upsert multiple items in specified table."""
        try:
            response = await self.client.table(table)\
                .upsert(items, on_conflict=",".join(unique_columns))\
                .execute()
            return response.data
        except Exception as e:
            print(f"Error upserting items in {table}: {e}")
            raise

    async def get_item_by_id(self, table: str, item_id: str) -> Optional[Dict[str, Any]]:
        """Get a single item by ID from specified table."""
        try:
            response = await self.client.table(table)\
                .select("*")\
                .eq("id", item_id)\
                .single()\
                .execute()
            return response.data
        except Exception as e:
            print(f"Error getting item from {table}: {e}")
            return None
