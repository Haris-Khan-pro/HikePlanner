# backend-hike/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest, ChatResponse
from app.chatbot.groq_chain import ask_hike_assistant
from app.routes import users  # 👈 import our new users route

app = FastAPI(title="Hike Planner AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(users.router)  # 👈 add this line

@app.get("/")
def root():
    return {"status": "Hike Planner Backend Running 🏔️"}

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    reply = ask_hike_assistant(payload.message)
    return {"reply": reply}