"""Router for LLM endpoints"""
from typing import List
from fastapi import Depends, HTTPException, APIRouter
from app.models.llm import LLM, LLMCreate, LLMUpdate, LLMProvider
from app.repositories.llm_repository import LLMRepository
from app.core.dependencies import get_current_user, get_supabase_client
from .base_router import BaseRouter


class LLMRouter(BaseRouter[LLM, LLMCreate, LLMUpdate]):
    """Router for LLM endpoints"""
    
    def __init__(self):
        """Initialize the LLM router"""
        super().__init__(
            prefix="/llms",
            repository_class=LLMRepository,
            response_model=LLM,
            create_schema=LLMCreate,
            update_schema=LLMUpdate,
            tags=["LLMs"]
        )
        
        # Register additional routes
        self._register_additional_routes()
    
    def _register_routes(self):
        # Register providers endpoint to be before /{item_id}
        @self.router.get("/providers")
        async def get_providers(user=Depends(get_current_user)):
            """Get all available LLM providers"""
            return [provider.value for provider in LLMProvider]

        return super()._register_routes()

    def _register_additional_routes(self):
        """Register additional LLM-specific routes"""
        
        @self.router.get("/by-provider/{provider}", response_model=List[LLM])
        async def get_by_provider(
            provider: str,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all LLMs for a specific provider"""
            repo = LLMRepository(supabase_client)
            try:
                return await repo.get_by_provider(provider, user_id=user.id)
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
