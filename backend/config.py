import os
import secrets
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/campus_companion")
    DB_NAME = os.getenv("DB_NAME", "campus_companion")
    SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_hex(32)
