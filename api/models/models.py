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

    # ✅ RELACIÓN CORRECTA: un usuario puede tener varias pantallas
    screens = relationship("Screen", back_populates="owner")

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

    playlists = relationship("Playlist", back_populates="screen")
    owner_id = Column(Integer, ForeignKey("users.id"))

    screen_key = Column(String, unique=True, index=True)  # 👈 Este campo debe existir


    # ✅ RELACIÓN CON USUARIO DUEÑO
    owner = relationship("User", back_populates="screens")

class Content(Base):
    __tablename__ = "contents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)  # image, video, html
    url = Column(Text)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # ❌ Línea eliminada: no tiene sentido relacionar content con Screen así
    # screens = relationship("Screen", back_populates="owner")

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
