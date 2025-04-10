"""Base router class for all routers"""
from typing import Generic, TypeVar, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.dependencies import get_current_user, get_supabase_client
from app.repositories.base_repository import BaseRepository

ModelType = TypeVar("ModelType", bound=BaseModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRouter(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base router class with common CRUD operations"""
    
    def __init__(
        self,
        *,
        prefix: str,
        repository_class: type[BaseRepository],
        response_model: type[ModelType],
        create_schema: type[CreateSchemaType],
        update_schema: type[UpdateSchemaType],
        tags: List[str]
    ):
        """Initialize the router with required components"""
        self.router = APIRouter(prefix=prefix, tags=tags)
        self.repository_class = repository_class
        self.response_model = response_model
        self.create_schema = create_schema
        self.update_schema = update_schema
        
        # Register common CRUD routes
        self._register_routes()
    
    def _register_routes(self):
        """Register common CRUD routes"""
        
        @self.router.get("/", response_model=List[self.response_model])
        async def get_all(
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all items"""
            repo = self.repository_class(supabase_client)
            return await repo.get_all(user_id=user.id)
        
        @self.router.get("/{item_id}", response_model=self.response_model)
        async def get_by_id(
            item_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get an item by ID"""
            repo = self.repository_class(supabase_client)
            item = await repo.get_by_id(item_id, user_id=user.id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            return item
        
        @self.router.post("/", response_model=self.response_model)
        async def create(
            data: self.create_schema,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Create a new item"""
            repo = self.repository_class(supabase_client)
            return await repo.create(data, user_id=user.id)
        
        @self.router.put("/{item_id}", response_model=self.response_model)
        async def update(
            item_id: int,
            data: self.update_schema,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Update an existing item"""
            repo = self.repository_class(supabase_client)
            try:
                return await repo.update(item_id, data, user_id=user.id)
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.router.delete("/{item_id}")
        async def delete(
            item_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Delete an item"""
            repo = self.repository_class(supabase_client)
            try:
                success = await repo.delete(item_id, user_id=user.id)
                if not success:
                    raise HTTPException(
                        status_code=404,
                        detail="Item not found"
                    )
                return {"status": "success"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

class TemplateRouter(BaseRouter[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Router class for entities that support templates"""
    
    def _register_routes(self):
        """Registered before super() to avoid the conflict with /{item_id} router"""
        @self.router.get("/templates", response_model=List[self.response_model])
        async def get_templates(
            include_builtin: bool = True,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all template items"""
            repo = self.repository_class(supabase_client)
            return await repo.get_templates(
                include_builtin=include_builtin,
                user_id=user.id
            )

        @self.router.post("/templates", response_model=self.response_model)
        async def create_template(
            data: self.create_schema,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Create a new template item"""
            repo = self.repository_class(supabase_client)
            # Convert to dict and set is_template to True
            create_data = data.model_dump()
            create_data["is_template"] = True
            return await repo.create(self.create_schema(**create_data), user_id=user.id)

        @self.router.put("/templates/{item_id}", response_model=self.response_model)
        async def update_template(
            item_id: int,
            data: self.update_schema,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Update a template item"""
            repo = self.repository_class(supabase_client)
            # Convert to dict and ensure is_template remains True
            update_data = data.model_dump(exclude_unset=True)
            update_data["is_template"] = True
            return await repo.update(item_id, self.update_schema(**update_data), user_id=user.id)

        @self.router.delete("/templates/{item_id}", response_model=Dict[str, str])
        async def delete_template(
            item_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Delete a template item"""
            repo = self.repository_class(supabase_client)
            success = await repo.delete(item_id, user_id=user.id)
            if not success:
                raise HTTPException(status_code=404, detail="Template not found")
            return {"status": "success"}

        @self.router.post(
            "/from-template/{template_id}",
            response_model=self.response_model
        )
        async def create_from_template(
            template_id: int,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Create a new item from a template"""
            repo = self.repository_class(supabase_client)
            
            # Get the template
            template = await repo.get_by_id(template_id, user_id=user.id)
            if not template:
                raise HTTPException(
                    status_code=404,
                    detail="Template not found"
                )
            
            if not template.is_template:
                raise HTTPException(
                    status_code=400,
                    detail="Specified item is not a template"
                )
            
            # Create new data from template
            template_dict = template.model_dump(exclude={
                "id",
                "created_at",
                "updated_at",
                "is_template",
                "is_builtin",
                "template_id",
                "template_version"
            })
            
            # Set template reference
            template_dict["template_id"] = template_id
            template_dict["template_version"] = template.template_version or 1
            template_dict["is_template"] = False
            template_dict["is_builtin"] = False
            
            # Create new item
            try:
                return await repo.create(
                    self.create_schema.model_validate(template_dict),
                    user_id=user.id
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        """Register common CRUD routes"""
        super()._register_routes()
        
        @self.router.get("/", response_model=List[self.response_model])
        async def get_all(
            include_templates: bool = True,
            user=Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Get all items"""
            repo = self.repository_class(supabase_client)
            return await repo.get_all(
                filters=None if include_templates else {"is_template": False},
                user_id=user.id
            )
