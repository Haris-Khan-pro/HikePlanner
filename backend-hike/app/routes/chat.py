from fastapi import APIRouter
from app.database import chat_history_collection
from app.models.chat_history import ChatMessageCreate, ChatMessageInDB
from app.chatbot.groq_chain import ask_hike_assistant
from app.schemas import ChatRequest, ChatResponse
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    # Get reply from AI
    reply = ask_hike_assistant(payload.message)

    # Save conversation to MongoDB
    chat_record = ChatMessageInDB(
        user_message=payload.message,
        bot_reply=reply,
        created_at=datetime.utcnow()
    )
    await chat_history_collection.insert_one(chat_record.dict())

    return {"reply": reply}

@router.get("/history")
async def get_chat_history(limit: int = 20):
    messages = []
    async for msg in chat_history_collection.find().sort("created_at", -1).limit(limit):
        msg["id"] = str(msg["_id"])
        del msg["_id"]
        messages.append(msg)
    return {"messages": messages}