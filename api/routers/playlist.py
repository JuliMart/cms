from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
import models
from schemas.schemas import PlaylistOut, PlaylistCreate

router = APIRouter()

@router.post("/", response_model=PlaylistOut)
def add_to_playlist(data: PlaylistCreate, db: Session = Depends(get_db)):
    item = models.Playlist(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/", response_model=PlaylistOut)
def list_all_playlists(db: Session = Depends(get_db)):
    return db.query(models.Playlist).order_by(models.Playlist.screen_id, models.Playlist.order_index).all()

@router.get("/screen/{screen_key}", response_model=PlaylistOut)
def get_playlist_by_screen(screen_key: str, db: Session = Depends(get_db)):
    screen = db.query(models.Screen).filter_by(screen_key=screen_key).first()
    if not screen:
        raise HTTPException(status_code=404, detail="Pantalla no encontrada")

    return db.query(models.Playlist)\
             .filter_by(screen_id=screen.id)\
             .order_by(models.Playlist.order_index).all()
