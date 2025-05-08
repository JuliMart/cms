# routers/content.py
import os
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models import models
from schemas import schemas
from datetime import datetime
import shutil
from fastapi import Depends


UPLOAD_FOLDER = "static/uploads"

router = APIRouter()

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Subir archivo
@router.post("/", response_model=schemas.ContentOut)
def upload_content(
    name: str = Form(...),
    type: str = Form(...),
    uploaded_by: int = Form(1),  # valor por defecto (puede cambiarse luego)
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/static/uploads/{filename}"
    new_content = models.Content(
        name=name,
        type=type,
        url=url,
        uploaded_by=uploaded_by,
        created_at=datetime.utcnow()
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content
    
@router.get("/", response_model=list[schemas.ContentOut])
def get_contents(db: Session = Depends(get_db)):
    return db.query(models.Content).all()
