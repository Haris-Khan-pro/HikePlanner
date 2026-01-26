from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest, ChatResponse
from app.chatbot.groq_chain import ask_hike_assistant

app = FastAPI(title="Hike Planner AI Backend")

# Allow Expo / Mobile access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Hike Planner Backend Running"}

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    reply = ask_hike_assistant(payload.message)
    return {"reply": reply}
