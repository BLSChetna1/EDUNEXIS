"""
LLM Service Interface & Abstraction Layer
Provides a unified interface for model inference (Gemini, OpenAI, Hugging Face, or local LLMs).
Currently running with placeholder mock implementation to avoid hardcoded credentials.
"""

from typing import Dict, Any, Optional
from abc import ABC, abstractmethod


class BaseLLMService(ABC):
    """Abstract base class for all LLM providers."""

    @abstractmethod
    async def generate_response(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Dict[str, Any]:
        """Generate text completion from the model."""
        pass


class MockLLMService(BaseLLMService):
    """
    Placeholder LLM implementation.
    Returns deterministic, safe responses for local development and testing
    without incurring API costs or requiring live keys.
    """

    def __init__(self, model_name: str = "mock-edunexis-v1"):
        self.model_name = model_name

    async def generate_response(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        if "stack" in prompt_lower and "queue" in prompt_lower:
            response_text = (
                "A stack is last-in, first-out: the newest item is removed first. "
                "A queue is first-in, first-out: the oldest item is removed first. "
                "Think of a stack of plates versus students waiting in a line."
            )
        else:
            response_text = (
                "Here is a simple way to think about it: start with the main idea, "
                "then connect it to a familiar everyday example."
            )
        return {
            "text": response_text,
            "model": self.model_name,
            "finish_reason": "stop",
            "usage": {
                "prompt_tokens": len(prompt.split()),
                "completion_tokens": 25,
                "total_tokens": len(prompt.split()) + 25,
            },
        }


def get_llm_service(provider: str = "mock") -> BaseLLMService:
    """Factory function to instantiate the configured LLM provider."""
    # Future integration: "gemini", "openai", "ollama"
    return MockLLMService()
