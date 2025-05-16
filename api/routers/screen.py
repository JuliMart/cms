# routers/screen.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models import models
from schemas import schemas
from datetime import datetime
from utils.security import get_current_user
from schemas.schemas import PlaylistCreate
from database.database import get_db


router = APIRouter()

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Registrar nueva pantalla
@router.post("/", response_model=schemas.ScreenOut)
def register_screen(
    screen: schemas.ScreenCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    new_screen = models.Screen(
        name=screen.name,
        location=screen.location,
        screen_key=screen.screen_key,
        resolution_width=screen.resolution_width,
        resolution_height=screen.resolution_height,
        layout_type=screen.layout_type,
        status="online",
        last_seen=datetime.utcnow(),
        owner_id=current_user.id,
        alias=screen.alias,
        address=screen.address,
        orientation=screen.orientation,
        device_type=screen.device_type,
        group=screen.group,
        notes=screen.notes
    )
    db.add(new_screen)
    db.commit()
    db.refresh(new_screen)
    return new_screen
    
@router.get("/by-id/{screen_id}/playlist", response_model=list[schemas.PlaylistOut])
def get_playlist_by_id(screen_id: int, db: Session = Depends(get_db)):
    screen = db.query(models.Screen).filter_by(id=screen_id).first()
    if not screen:
        raise HTTPException(status_code=404, detail="Pantalla no encontrada")

    playlist = (
        db.query(models.Playlist)
        .filter_by(screen_id=screen.id)
        .order_by(models.Playlist.order_index)
        .all()
    )
    return playlist
from utils.security import get_current_user

@router.get("/", response_model=list[schemas.ScreenOut])
def get_user_screens(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    screens = db.query(models.Screen).filter(models.Screen.owner_id == current_user.id).all()
    return screens

@router.post("/{screen_id}/playlist", response_model=schemas.PlaylistOut)
def asignar_contenido(screen_id: int, data: PlaylistCreate, db: Session = Depends(get_db)):
    # Validar existencia de pantalla y contenido
    screen = db.query(models.Screen).filter_by(id=screen_id).first()
    content = db.query(models.Content).filter_by(id=data.content_id).first()
    if not screen or not content:
        raise HTTPException(status_code=404, detail="Pantalla o contenido no encontrado")

    item = models.Playlist(
        screen_id=screen.id,
        content_id=data.content_id,
        start_time=data.start_time,
        end_time=data.end_time,
        order_index=data.order_index
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
@router.get("/screens")
def get_user_screens(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Screen).filter_by(owner_id=current_user.id).all()
@router.put("/{screen_id}")
def update_screen(
    screen_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    screen = db.query(models.Screen).filter(
        models.Screen.id == screen_id,
        models.Screen.owner_id == current_user.id
    ).first()

    if not screen:
        raise HTTPException(status_code=404, detail="Pantalla no encontrada")

    screen.name = payload.get("name", screen.name)
    screen.location = payload.get("location", screen.location)
    db.commit()
    return {"message": "Pantalla actualizada"}
@router.delete("/{screen_id}")
def delete_screen(
    screen_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    screen = db.query(models.Screen).filter(
        models.Screen.id == screen_id,
        models.Screen.owner_id == current_user.id
    ).first()

    if not screen:
        raise HTTPException(status_code=404, detail="Pantalla no encontrada")

    db.delete(screen)
    db.commit()
    return {"message": "Pantalla eliminada"}
