from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Save a chat message to DB
class ChatMessageCreate(BaseModel):
    user_id: Optional[str] = None   # optional, if user is logged in
    user_message: str
    bot_reply: str

# What we send back
class ChatMessageResponse(BaseModel):
    id: str
    user_id: Optional[str]
    user_message: str
    bot_reply: str
    created_at: datetime

# What's stored in DB
class ChatMessageInDB(BaseModel):
    user_id: Optional[str] = None
    user_message: str
    bot_reply: str
    created_at: datetime = datetime.utcnow()