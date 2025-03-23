"""Utility functions for LLM integration"""
from typing import Optional, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_deepseek import ChatDeepseek
from langchain_community.llms import Ollama
from app.models.llm import LLMProvider
from app.services.encryption import encryption_service
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_llm_from_config(
    provider: LLMProvider,
    model: str,
    api_key: Optional[str] = None,
    temperature: float = 0.5,
    **kwargs: Dict[str, Any]
):
    """Get LLM instance based on provider and config"""
    try:
        # Decrypt API key if provided
        if api_key:
            api_key = encryption_service.decrypt(api_key)
        
        if provider == LLMProvider.GEMINI:
            return ChatGoogleGenerativeAI(
                model=model or "gemini-pro",
                verbose=True,
                temperature=temperature,
                google_api_key=api_key,
                **kwargs
            )
        elif provider == LLMProvider.ANTHROPIC:
            return ChatAnthropic(
                model=model or "claude-3.5-sonnet",
                verbose=True,
                temperature=temperature,
                anthropic_api_key=api_key,
                **kwargs
            )
        elif provider == LLMProvider.OPENAI:
            return ChatOpenAI(
                model=model or "gpt-4o",
                verbose=True,
                temperature=temperature,
                openai_api_key=api_key,
                **kwargs
            )
        elif provider == LLMProvider.DEEPSEEK:
            return ChatDeepseek(
                model=model or "deepseek-reasoner",
                verbose=True,
                temperature=temperature,
                api_key=api_key,
                **kwargs
            )
        elif provider == LLMProvider.OLLAMA:
            return Ollama(
                model=model or "deepseek-r1",
                verbose=True,
                temperature=temperature,
                **kwargs
            )
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")
    except Exception as e:
        logger.error(f"Failed to initialize LLM {provider}: {str(e)}")
        raise