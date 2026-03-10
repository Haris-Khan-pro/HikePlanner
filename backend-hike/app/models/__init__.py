# backend-hike/app/models/__init__.py

from .user import UserCreate, UserClerkSync, UserInDB, UserResponse, UserUpdate
from .trail import TrailCreate, TrailInDB, TrailResponse, TrailUpdate
from .activity import ActivityCreate, ActivityInDB, ActivityResponse, ActivityStats, GpsPoint
from .review import ReviewCreate, ReviewInDB, ReviewResponse, ReviewUpdate
from .chat_history import ChatMessageCreate, ChatMessageInDB, ChatMessageResponse