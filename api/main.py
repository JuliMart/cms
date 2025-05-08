# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, content, screen
from database.database import engine
from models.models import Base
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/auth")
app.include_router(content.router, prefix="/contents")
app.include_router(screen.router, prefix="/screens")

# Crear las tablas al iniciar
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "CMS FastAPI funcionando"}
