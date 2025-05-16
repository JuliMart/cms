# routers/content.py

import os
import shutil
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models import models
from schemas import schemas
from database.database import get_db

UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXT = (".png", ".jpg", ".jpeg", ".mp4")

router = APIRouter()  # Se monta en main.py con prefix="/content"

# Dependencia de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1) SUBIDA DE CONTENIDO
@router.post("/", response_model=schemas.ContentOut)
def upload_content(
    name: str = Form(...),
    type: str = Form(...),
    uploaded_by: int = Form(1),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # ——— Validación de extensión antes de guardar ———
    if not file.filename.lower().endswith(ALLOWED_EXT):
        raise HTTPException(status_code=400, detail="Solo PNG/JPG/MP4 permitidos")

    # ——— Validación cruzada del 'type' ———
    if file.filename.lower().endswith(".mp4") and type != "video":
        raise HTTPException(status_code=400, detail="Archivo MP4, type debe ser 'video'")
    if file.filename.lower().endswith((".png", ".jpg", ".jpeg")) and type != "image":
        raise HTTPException(status_code=400, detail="Archivo de imagen, type debe ser 'image'")

    # Guardado físico
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    with open(path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    # Registro en DB
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

# 2) LISTAR CONTENIDOS
@router.get("/", response_model=list[schemas.ContentOut])
def get_contents(db: Session = Depends(get_db)):
    return db.query(models.Content).all()

# 3) EDITAR NOMBRE (PUT /content/{id})
@router.put("/{content_id}")
def update_content_name(
    content_id: int,
    payload: dict,
    db: Session = Depends(get_db)
):
    content = db.query(models.Content).get(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Contenido no encontrado")

    content.name = payload.get("name", content.name)
    db.commit()
    return {"message": "Contenido actualizado"}

# 4) ELIMINAR (DELETE /content/{id})
@router.delete("/{content_id}")
def delete_content(
    content_id: int,
    db: Session = Depends(get_db)
):
    content = db.query(models.Content).get(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Contenido no encontrado")

    db.delete(content)
    db.commit()
    return {"message": "Contenido eliminado"}
