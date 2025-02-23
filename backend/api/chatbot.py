from fastapi import APIRouter
from pydantic import BaseModel
import random

chatbot_router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


# Pydantic model for request
class ChatRequest(BaseModel):
    message: str


# Mock responses
MOCK_RESPONSES = [
    "That sounds delicious! Have you checked your glucose levels?",
    "Interesting choice! Let me check how that affects your blood sugar.",
    "Great! Do you want a low-carb alternative?",
    "Hmm, I’d suggest pairing that with some fiber to slow glucose spikes.",
    "That’s a solid choice! Would you like some recipe ideas?",
]


@chatbot_router.get("/")
async def chatbot_home():
    return {"message": "Welcome to the Chatbot API!"}


@chatbot_router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Mock chatbot that returns a pre-defined or dynamic response."""
    user_message = request.message.lower()

    # Basic rule-based responses
    if "pizza" in user_message:
        return {"response": "Pizza is great! Do you want a low-carb alternative?"}
    elif "pasta" in user_message:
        return {"response": "Pasta is delicious! Whole wheat or protein pasta might be better for glucose control."}
    elif "sugar" in user_message:
        return {"response": "Too much sugar can spike glucose! Consider a sugar-free alternative."}
    elif "recommend" in user_message or "suggest" in user_message:
        return {"response": random.choice(MOCK_RESPONSES)}
    else:
        return {"response": random.choice(MOCK_RESPONSES)}
