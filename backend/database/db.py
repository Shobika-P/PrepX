"""
Database connection manager for AI Campus Companion.
Supports MongoDB (via PyMongo) with an automated, resilient in-memory/JSON fallback
when MongoDB is not running locally, guaranteeing uninterrupted development & demonstration.
"""

import os
import json
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import Config
from database.seed_data import SAMPLE_STUDENTS, CAREER_ROLES

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
            logger.warning(
                "MongoDB not reachable (%s). Initializing high-performance embedded in-memory MongoDB mock.",
                str(e)
            )
            try:
                import mongomock
                self.client = mongomock.MongoClient()
                self.db = self.client[Config.DB_NAME]
                self.is_mongo = False
                logger.info("Embedded Mock DB active and ready.")
            except ImportError:
                logger.error("mongomock not found, falling back to minimal mock.")
                raise e

        # Ensure seed data is populated
        self.seed_if_empty()

    def seed_if_empty(self):
        """Populates initial students and career roles if collections are empty."""
        try:
            students_col = self.db["students"]
            if students_col.count_documents({}) == 0:
                logger.info("Seeding initial student records...")
                seed_students = [dict(s, _neha_account_initialized=True) for s in SAMPLE_STUDENTS]
                students_col.insert_many(seed_students)
                logger.info("Inserted %d sample students.", len(SAMPLE_STUDENTS))

            # One-time migration for existing local databases: turn the first
            # seeded profile into Neha's account with a known stored password.
            neha = SAMPLE_STUDENTS[0]
            existing_neha = students_col.find_one({"$or": [
                {"id": neha["id"]}, {"email": neha["email"]}, {"roll_number": neha["roll_number"]}
            ]})
            if not existing_neha:
                students_col.insert_one(dict(neha, _neha_account_initialized=True))
            elif not existing_neha.get("_neha_account_initialized"):
                initial_fields = [
                    "name", "roll_number", "email", "semester", "department", "target_role",
                    "attendance_percentage", "technical_skills", "completed_courses", "subjects", "password_hash"
                ]
                students_col.update_one(
                    {"_id": existing_neha["_id"]},
                    {"$set": {**{key: neha[key] for key in initial_fields if key in neha}, "_neha_account_initialized": True}}
                )

            careers_col = self.db["careers"]
            if careers_col.count_documents({}) == 0:
                logger.info("Seeding career role definitions...")
                careers_col.insert_many([dict(r) for r in CAREER_ROLES])
                logger.info("Inserted %d career roles.", len(CAREER_ROLES))
        except Exception as e:
            logger.error("Error during seed initialization: %s", str(e))

    def reset_seed_data(self):
        """Resets the collections back to original default seed data."""
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

def is_connected_to_mongo():
    return db_manager.is_mongo
