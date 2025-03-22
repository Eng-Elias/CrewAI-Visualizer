"""Main FastAPI application module"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Set default encryption key if not provided
if not os.getenv("ENCRYPTION_KEY"):
    os.environ["ENCRYPTION_KEY"] = "YourDefaultEncryptionKeyForDevelopment=="

app = FastAPI(
    title=os.getenv('APP_TITLE', 'CrewAI Visualizer API'),
    description=os.getenv('APP_DESCRIPTION', 'API for CrewAI Visualizer'),
    version=os.getenv('APP_VERSION', '1.0.0')
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": os.getenv('ENVIRONMENT', 'development')
    }

@app.get("/")
async def read_root():
    """Root endpoint for the API"""
    return {
        "message": os.getenv('API_WELCOME_MESSAGE', 'Welcome to CrewAI Visualizer API'),
        "version": os.getenv('APP_VERSION', '1.0.0'),
        "docs": "Visit /docs for interactive API documentation",
        "redoc": "Visit /redoc for alternative API documentation"
    }

# Import and include routers after FastAPI app is created
from app.routers import routers
for router in routers:
    app.include_router(router)
