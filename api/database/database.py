# database/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./cms.db"  # para demo local; reemplazar por PostgreSQL en producción

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # necesario para SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
