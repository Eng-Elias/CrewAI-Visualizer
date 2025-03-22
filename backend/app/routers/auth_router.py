"""Router for authentication endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.auth import (
    AuthRequest, AuthResponse, UserSignUp, UserSignIn,
    TokenResponse, AuthUser
)
from app.models.user import User
from app.core.dependencies import (
    get_supabase_client, get_current_user, verify_user_access
)


class AuthRouter:
    """Router for authentication endpoints"""
    
    def __init__(self):
        """Initialize the auth router"""
        self.router = APIRouter(
            prefix="/auth",
            tags=["Authentication"]
        )
        self._register_routes()
    
    def _register_routes(self):
        """Register auth routes"""
        
        @self.router.post("/signup", response_model=TokenResponse)
        def sign_up(
            user: UserSignUp,
            supabase_client=Depends(get_supabase_client)
        ):
            """Sign up a new user"""
            try:
                response = supabase_client.auth.sign_up({
                    "email": user.email,
                    "password": user.password
                })
                
                if not response.user:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Failed to create user"
                    )
                
                return TokenResponse(
                    access_token=response.session.access_token,
                    refresh_token=response.session.refresh_token,
                    user=AuthUser(
                        id=response.user.id,
                        email=response.user.email,
                        user_metadata=response.user.user_metadata
                    )
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e)
                )
        
        @self.router.post("/signin", response_model=TokenResponse)
        def sign_in(
            user: UserSignIn,
            supabase_client=Depends(get_supabase_client)
        ):
            """Sign in an existing user"""
            try:
                response = supabase_client.auth.sign_in_with_password({
                    "email": user.email,
                    "password": user.password
                })
                
                return TokenResponse(
                    access_token=response.session.access_token,
                    refresh_token=response.session.refresh_token,
                    user=AuthUser(
                        id=response.user.id,
                        email=response.user.email,
                        user_metadata=response.user.user_metadata
                    )
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=str(e)
                )
        
        @self.router.post("/signout")
        def sign_out(
            current_user: User = Depends(get_current_user),
            supabase_client=Depends(get_supabase_client)
        ):
            """Sign out the current user"""
            try:
                supabase_client.auth.sign_out()
                return {"message": "Successfully signed out"}
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e)
                )
        
        @self.router.post("/verify", response_model=AuthResponse)
        def verify_token(
            auth: AuthRequest,
            supabase_client=Depends(get_supabase_client)
        ):
            """Verify a JWT token and return user info"""
            try:
                # Verify token with Supabase
                user = supabase_client.auth.get_user(auth.access_token)
                
                # Return user info
                return AuthResponse(
                    user_id=user.user.id,
                    email=user.user.email,
                    access_token=auth.access_token
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials"
                )
        
        @self.router.get("/me", response_model=AuthUser)
        def get_me(
            current_user: User = Depends(get_current_user),
            has_access: bool = Depends(verify_user_access)
        ):
            """Get the current user's information"""
            if not has_access:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
            
            return AuthUser(
                id=current_user.id,
                email=current_user.email,
                user_metadata=current_user.user_metadata
            )
