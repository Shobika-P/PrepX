
import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

    MONGO_URI = (
        os.getenv("MONGODB_URI")
        or os.getenv("MONGO_URI")
        or "mongodb://localhost:27017/campus_companion"
    )

    DB_NAME = (
        os.getenv("DATABASE_NAME")
        or os.getenv("DB_NAME")
        or "campus_companion"
    )

    SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_hex(32)
