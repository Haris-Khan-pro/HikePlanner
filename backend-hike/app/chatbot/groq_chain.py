from langchain_groq import ChatGroq
from app.config import GROQ_API_KEY

llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama3-8b-8192",
    temperature=0.7
)

def ask_hike_assistant(user_message: str) -> str:
    system_prompt = (
        "You are a helpful hiking assistant. "
        "You help users with trails, safety, equipment, and planning hikes."
    )

    response = llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ])

    return response.content
