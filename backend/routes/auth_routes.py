"""
Authentication & Student Profile Memory Routes (/api/auth).
Handles student account creation, secure login, persistent session lookup, and profile updates.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection, get_careers_collection
from models.student_model import validate_student_data, serialize_student
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

def get_bearer_token(req):
    """Extracts a bearer token from request headers."""
    auth_header = req.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1].strip()
    return req.headers.get("X-Student-Token") or req.headers.get("X-Student-Id")

@auth_bp.route("/register", methods=["POST"])
def register_student():
    """Registers a new student account with persistent memory."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Request payload must be valid JSON."}), 400

        email = str(data.get("email", "")).strip().lower()
        roll_number = str(data.get("roll_number", "")).strip().upper()
        password = str(data.get("password", ""))
        name = str(data.get("name", "")).strip()

        if not name:
            return jsonify({"status": "error", "message": "Full Name is required."}), 400
        if len(password) < 8:
            return jsonify({"status": "error", "message": "Password must be at least 8 characters."}), 400
        if not email:
            return jsonify({"status": "error", "message": "Email address is required."}), 400

        col = get_students_collection()
        existing = col.find_one({"$or": [{"email": email}, {"roll_number": roll_number}]})
        if existing:
            return jsonify({"status": "error", "message": "A student account with this Email or Roll Number already exists."}), 409

        if not data.get("department") or not data.get("semester") or not data.get("target_role"):
            return jsonify({"status": "error", "message": "Department, semester, and career goal are required to create a profile."}), 400
        if not get_careers_collection().find_one({"id": str(data["target_role"]).strip()}):
            return jsonify({"status": "error", "message": "Select a career role from the available options."}), 400
        data["subjects"] = data.get("subjects") or []

        validated_data = validate_student_data(data, is_update=False)

        student_id = f"STU_{uuid.uuid4().hex[:6].upper()}"
        session_token = uuid.uuid4().hex + uuid.uuid4().hex

        validated_data["id"] = student_id
        validated_data["email"] = email
        validated_data["password_hash"] = generate_password_hash(password)
        validated_data["token"] = session_token
        validated_data["career_goal"] = data.get("career_goal", {
            "target_role": validated_data.get("target_role"),
            "target_companies": [],
            "salary_expectation": "",
            "work_preference": "",
            "preferred_domain": ""
        })

        col.insert_one(validated_data)
        user_data = serialize_student(validated_data)

        return jsonify({
            "status": "success",
            "message": "Student account created successfully!",
            "token": session_token,
            "user": user_data
        }), 201
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login_student():
    """Logs in an existing student account or seed demo account."""
    try:
        data = request.get_json() or {}
        identifier = str(data.get("identifier", "")).strip()
        password = str(data.get("password", ""))

        if not identifier:
            return jsonify({"status": "error", "message": "Email or Roll Number is required."}), 400

        col = get_students_collection()
        student = col.find_one({
            "$or": [
                {"email": identifier.lower()},
                {"roll_number": identifier.upper()},
                {"id": identifier}
            ]
        })

        if not student:
            return jsonify({"status": "error", "message": f"No student account found with identifier '{identifier}'."}), 404

        # Seeded accounts and registered accounts both require a stored password.
        if "password_hash" in student and student["password_hash"]:
            if not password or not check_password_hash(student["password_hash"], password):
                return jsonify({"status": "error", "message": "Incorrect password. Please try again."}), 401
        else:
            return jsonify({"status": "error", "message": "This account has no password configured. Create a student profile to continue."}), 401

        session_token = uuid.uuid4().hex + uuid.uuid4().hex
        col.update_one({"id": student["id"]}, {"$set": {"token": session_token}})

        user_data = serialize_student(student)
        user_data["token"] = session_token
        if "password_hash" in user_data:
            del user_data["password_hash"]

        return jsonify({
            "status": "success",
            "message": f"Welcome back, {user_data.get('name', 'Student')}!",
            "token": session_token,
            "user": user_data
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    """Gets currently authenticated student profile."""
    try:
        token = get_bearer_token(request)
        if not token:
            return jsonify({"status": "error", "message": "No authorization token provided."}), 401

        col = get_students_collection()
        student = col.find_one({"token": token})

        if not student:
            return jsonify({"status": "error", "message": "Session expired or invalid token."}), 401

        user_data = serialize_student(student)
        if "password_hash" in user_data:
            del user_data["password_hash"]

        return jsonify({
            "status": "success",
            "user": user_data
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    """Updates student academic details, skills, and career goal in persistent memory."""
    try:
        data = request.get_json() or {}
        token = get_bearer_token(request)
        if not token:
            return jsonify({"status": "error", "message": "Authentication required."}), 401

        col = get_students_collection()
        existing = col.find_one({"token": token})

        if not existing:
            return jsonify({"status": "error", "message": "Student profile not found."}), 404

        target_id = existing["id"]

        if data.get("id") and data["id"] != target_id:
            return jsonify({"status": "error", "message": "You cannot update another student's profile."}), 403

        # Clean student fields
        validated = validate_student_data(data, is_update=True)

        for unique_field in ("email", "roll_number"):
            if unique_field in validated:
                duplicate = col.find_one({unique_field: validated[unique_field]})
                if duplicate and duplicate.get("id") != target_id:
                    return jsonify({"status": "error", "message": f"That {unique_field.replace('_', ' ')} is already in use."}), 409
        if validated.get("target_role") and not get_careers_collection().find_one({"id": validated["target_role"]}):
            return jsonify({"status": "error", "message": "Select a career role from the available options."}), 400

        if "career_goal" in data and isinstance(data["career_goal"], dict):
            validated["career_goal"] = data["career_goal"]

        col.update_one({"id": target_id}, {"$set": validated})
        updated = col.find_one({"id": target_id})

        user_data = serialize_student(updated)
        if "password_hash" in user_data:
            del user_data["password_hash"]

        return jsonify({
            "status": "success",
            "message": "Student profile and academic memory updated successfully!",
            "user": user_data
        }), 200
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
