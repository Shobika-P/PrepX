"""MongoDB connection manager with an explicitly non-persistent demo fallback."""
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import Config
from database.seed_data import CAREER_ROLES

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DatabaseManager")

class Database:
    _instance = None

    def __init__(self):
        self.is_mongo = False
        self.client = None
        self.db = None
        self.connect()

    def connect(self):
        try:
            # Attempt to connect to MongoDB with a short timeout
            self.client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=2000)
            # Trigger a connection check
            self.client.admin.command('ping')
            self.db = self.client[Config.DB_NAME]
            self.is_mongo = True
            logger.info("Successfully connected to live MongoDB at %s", Config.MONGO_URI)
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            logger.warning("MongoDB unavailable (%s). Using a temporary in-memory mock; data will be lost on restart.", str(e))
            try:
                import mongomock
                self.client = mongomock.MongoClient()
                self.db = self.client[Config.DB_NAME]
                self.is_mongo = False
                logger.info("Non-persistent in-memory mock active.")
            except ImportError:
                logger.error("mongomock not found, falling back to minimal mock.")
                raise e

        # Student accounts are always user-created. Only public career definitions are seeded.
        self.seed_if_empty()

    def seed_if_empty(self):
        """Removes legacy demo accounts and seeds public career roles if needed."""
        try:
            careers_col = self.db["careers"]
            # Remove records created by the old hard-coded demo dataset during startup.
            self.db["students"].delete_many({"$or": [
                {"_neha_account_initialized": True},
                {"id": {"$in": ["STU001", "STU002", "STU003", "STU004", "STU005"]}}
            ]})
            if careers_col.count_documents({}) == 0:
                logger.info("Seeding career role definitions...")
                careers_col.insert_many([dict(r) for r in CAREER_ROLES])
                logger.info("Inserted %d career roles.", len(CAREER_ROLES))
        except Exception as e:
            logger.error("Error during seed initialization: %s", str(e))

    def reset_seed_data(self):
        """Resets the collections back to original default seed data."""
        # No sample/demo accounts are inserted into the student collection.
        self.db["students"].delete_many({})
        self.db["careers"].delete_many({})
        self.seed_if_empty()

db_manager = Database()

def get_db():
    return db_manager.db

def get_students_collection():
    return db_manager.db["students"]

def get_careers_collection():
    return db_manager.db["careers"]

def get_assessment_attempts_collection():
    return db_manager.db["assessment_attempts"]

def is_connected_to_mongo():
    return db_manager.is_mongo
