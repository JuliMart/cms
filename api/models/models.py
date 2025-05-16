from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="admin")

    # ✅ Un usuario puede tener muchas pantallas y muchos contenidos
    screens = relationship("Screen", back_populates="owner")
    contents = relationship("Content", back_populates="uploader")  # 👈 agregado

class Screen(Base):
    __tablename__ = "screens"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    resolution_width = Column(Integer, default=1920)
    resolution_height = Column(Integer, default=1080)
    layout_type = Column(String, default="full")
    status = Column(String, default="offline")
    last_seen = Column(DateTime, default=datetime.utcnow)
    screen_key = Column(String, unique=True, index=True)

    # 🔽 Nuevos campos
    alias = Column(String, nullable=True)
    address = Column(String, nullable=True)
    orientation = Column(String, default="horizontal")
    device_type = Column(String, nullable=True)
    group = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    # Relaciones
    owner = relationship("User", back_populates="screens")
    playlists = relationship("Playlist", back_populates="screen")

class Content(Base):
    __tablename__ = "contents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)  # image, video, html
    url = Column(Text)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ Asociación al usuario que lo subió
    uploader = relationship("User", back_populates="contents")

class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True, index=True)
    screen_id = Column(Integer, ForeignKey("screens.id"))
    content_id = Column(Integer, ForeignKey("contents.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    order_index = Column(Integer, default=0)

    screen = relationship("Screen", back_populates="playlists")
    content = relationship("Content")
