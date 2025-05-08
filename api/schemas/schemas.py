# schemas/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# ---------- USER ----------
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: str

model_config = ConfigDict(from_attributes=True)

# ---------- CONTENT ----------
class ContentBase(BaseModel):
    name: str
    type: str  # image, video, html
    url: str

class ContentCreate(ContentBase):
    uploaded_by: int

class ContentOut(ContentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---------- SCREEN ----------
class ScreenBase(BaseModel):
    name: str
    location: str

class ScreenCreate(ScreenBase):
    screen_key: str  # 👈 Asegurate de incluir este campo si lo estás usando
    resolution_width: Optional[int] = 1920
    resolution_height: Optional[int] = 1080
    layout_type: Optional[str] = "full"


class ScreenOut(BaseModel):
    id: int
    name: str
    location: str
    screen_key: str
    resolution_width: int
    resolution_height: int
    layout_type: str
    status: str
    last_seen: datetime

    class Config:
        orm_mode = True

# ---------- PLAYLIST ----------
class PlaylistBase(BaseModel):
    screen_id: int
    content_id: int
    start_time: datetime
    end_time: datetime
    order_index: Optional[int] = 0

class PlaylistCreate(PlaylistBase):
    pass

class PlaylistOut(PlaylistBase):
    id: int
    content: ContentOut

model_config = {
    "from_attributes": True
}
