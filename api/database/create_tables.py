from database.database import Base, engine
from models import models  # asegúrate de que `models` también esté importable

Base.metadata.create_all(bind=engine)
