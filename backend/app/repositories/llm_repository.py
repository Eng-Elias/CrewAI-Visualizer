from typing import List, Optional, Dict, Any
from app.models.llm import LLM, LLMCreate, LLMUpdate
from app.services.encryption import encryption_service
from supabase import Client


class LLMRepository:
    """Repository for managing LLMs in Supabase"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.table = "LLMs"
    
    async def get_all(self, user_id: str = None) -> List[Dict[str, Any]]:
        """Get all LLMs from the database for a specific user"""
        query = self.supabase.table(self.table).select("*")
        
        # Filter by user_id if provided
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        llms = response.data
        
        # Decrypt API keys
        for llm in llms:
            if llm.get("api_key"):
                llm["api_key"] = encryption_service.decrypt(llm["api_key"])
                
        return llms
    
    async def get_by_id(self, llm_id: int, user_id: str = None) -> Optional[Dict[str, Any]]:
        """Get an LLM by its ID, optionally filtering by user_id"""
        query = self.supabase.table(self.table).select("*").eq("id", llm_id)
        
        # Filter by user_id if provided
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            return None
            
        llm = response.data[0]
        
        # Decrypt API key
        if llm.get("api_key"):
            llm["api_key"] = encryption_service.decrypt(llm["api_key"])
            
        return llm
    
    async def create(self, llm_data: LLMCreate, user_id: str = None) -> Dict[str, Any]:
        """Create a new LLM in the database"""
        # Convert to dict for Supabase
        data = llm_data.model_dump()
        
        # Add user_id if provided
        if user_id:
            data["user_id"] = user_id
        
        # Encrypt API key if provided
        if data.get("api_key"):
            data["api_key"] = encryption_service.encrypt(data["api_key"])
        
        # Insert into Supabase
        response = self.supabase.table(self.table).insert(data).execute()
        
        if not response.data:
            raise Exception("Failed to create LLM")
            
        created_llm = response.data[0]
        
        # Decrypt API key for return value
        if created_llm.get("api_key"):
            created_llm["api_key"] = encryption_service.decrypt(created_llm["api_key"])
            
        return created_llm
    
    async def update(self, llm_id: int, llm_data: LLMUpdate, user_id: str = None) -> Dict[str, Any]:
        """Update an existing LLM in the database"""
        # Convert to dict and remove None values
        data = {k: v for k, v in llm_data.model_dump().items() if v is not None}
        
        # Encrypt API key if provided
        if data.get("api_key"):
            data["api_key"] = encryption_service.encrypt(data["api_key"])
        
        # Build query
        query = self.supabase.table(self.table).update(data).eq("id", llm_id)
        
        # Filter by user_id if provided
        if user_id:
            query = query.eq("user_id", user_id)
        
        # Execute update
        response = query.execute()
        
        if not response.data:
            raise Exception(f"Failed to update LLM with ID {llm_id}")
            
        updated_llm = response.data[0]
        
        # Decrypt API key for return value
        if updated_llm.get("api_key"):
            updated_llm["api_key"] = encryption_service.decrypt(updated_llm["api_key"])
            
        return updated_llm
    
    async def delete(self, llm_id: int, user_id: str = None) -> bool:
        """Delete an LLM from the database"""
        query = self.supabase.table(self.table).delete().eq("id", llm_id)
        
        # Filter by user_id if provided
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        
        if not response.data:
            return False
            
        return True
