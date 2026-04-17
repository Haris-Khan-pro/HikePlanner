from langchain_groq import ChatGroq
from app.config import GROQ_API_KEY
import logging

logger = logging.getLogger(__name__)

llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
    temperature=0.7,
    timeout=30  # 30 second timeout
)

def ask_hike_assistant(user_message: str) -> str:
    try:
        system_prompt = (
            "You are a helpful hiking assistant. "
            "You help users with trails, safety, equipment, and planning hikes. "
            "Keep responses concise and helpful."
        )

        response = llm.invoke([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ])

        return response.content
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return f"Sorry, I'm having trouble processing your request. Please try again in a moment."