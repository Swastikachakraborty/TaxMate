"""GigSaathi — Agent Chat Routes.

Streaming chat endpoint that connects the user to the Gemini agent.
Uses Server-Sent Events (SSE) for real-time response streaming.
"""

import json
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.db.database import mongodb
from app.agent.agent import agent
from app.limiter import limiter

router = APIRouter()


class ChatMessage(BaseModel):
    """Incoming chat message from the user."""
    message: str
    user_id: str


class ChatResponse(BaseModel):
    """Chat response from the agent."""
    response: str
    tools_called: list[str]
    timestamp: str


@router.post("/chat")
@limiter.limit("20/minute")
async def chat_with_agent(request: Request, chat_msg: ChatMessage):
    """Send a message to the GigSaathi agent and get a response.

    Rate limited to 20 requests per minute per IP address.

    The agent will automatically decide which tools to call based on
    the user's question, execute them to fetch real data, and return
    a natural language response grounded in actual numbers.

    Args:
        request: FastAPI request (used by rate limiter for IP resolution).
        chat_msg: The user's message and user_id.

    Returns:
        The agent's response, list of tools called, and tool results.
    """
    # Verify user exists
    user = await mongodb.user_profiles.find_one({"user_id": chat_msg.user_id})
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User '{chat_msg.user_id}' not found. Please set up your profile first.",
        )

    try:
        result = await agent.chat(chat_msg.user_id, chat_msg.message)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent error: {str(e)}",
        )


@router.post("/chat/stream")
@limiter.limit("10/minute")
async def chat_stream(request: Request, chat_msg: ChatMessage):
    """Stream the agent's response using Server-Sent Events (SSE).

    Rate limited to 10 requests per minute per IP address (SSE connections
    are heavier on server resources than regular chat).

    This endpoint returns a streaming response where each event contains
    a chunk of the agent's reply. Useful for real-time display in the frontend.

    Events:
        - type: "thinking" — Agent is processing / calling tools
        - type: "tool_call" — Agent invoked a tool (name included)
        - type: "content" — A chunk of the response text
        - type: "done" — Final event with complete response
        - type: "error" — An error occurred

    Args:
        request: FastAPI request (used by rate limiter for IP resolution).
        chat_msg: The user's message and user_id.
    """
    user = await mongodb.user_profiles.find_one({"user_id": chat_msg.user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{chat_msg.user_id}' not found")

    async def event_generator():
        try:
            # Emit "thinking" event
            yield f"data: {json.dumps({'type': 'thinking', 'content': 'Analyzing your question...'})}\n\n"

            # Run the agent (non-streaming internally, but we emit events)
            result = await agent.chat(chat_msg.user_id, chat_msg.message)

            # Emit tool call events
            for tool_name in result.get("tools_called", []):
                yield f"data: {json.dumps({'type': 'tool_call', 'content': tool_name})}\n\n"

            # Emit the response in chunks (simulate streaming for smooth UX)
            response_text = result.get("response", "")
            # Send in sentence-level chunks for natural feel
            sentences = response_text.replace("\n", "\n|SPLIT|").split("|SPLIT|")
            for chunk in sentences:
                if chunk.strip():
                    yield f"data: {json.dumps({'type': 'content', 'content': chunk})}\n\n"

            # Emit done event with metadata
            yield f"data: {json.dumps({'type': 'done', 'tools_called': result.get('tools_called', []), 'timestamp': datetime.utcnow().isoformat()})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )


@router.delete("/chat/{user_id}/history")
async def clear_chat_history(user_id: str):
    """Clear the conversation history for a user.

    Useful for starting a fresh conversation with the agent.

    Args:
        user_id: The user whose history to clear.
    """
    agent.clear_history(user_id)
    return {"message": f"Chat history cleared for user {user_id}"}
