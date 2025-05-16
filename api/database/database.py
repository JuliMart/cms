# database/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = "sqlite:///./cms.db"  # local demo

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # necesario para SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 👉 Esta es la función global para usar en Depends()
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
