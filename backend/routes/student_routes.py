"""
Student Data Management Routes (/api/students).
Provides CRUD endpoints and data management for student profiles.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection
from models.student_model import validate_student_data, serialize_student
from auth import authenticated
from flask import g

student_bp = Blueprint("students", __name__, url_prefix="/api/students")

@student_bp.route("", methods=["GET"])
@authenticated
def get_all_students():
    """Returns list of all students."""
    try:
        col = get_students_collection()
        serialized = [serialize_student(g.student)]
        return jsonify({"status": "success", "count": len(serialized), "data": serialized}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("/<student_id>", methods=["GET"])
@authenticated
def get_student_by_id(student_id):
    """Fetches a specific student by ID or roll number."""
    try:
        col = get_students_collection()
        return jsonify({"status": "success", "data": serialize_student(g.student)}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("", methods=["POST"])
def create_student():
    return jsonify({"status": "error", "message": "Create an account through /api/auth/register."}), 405

@student_bp.route("/<student_id>", methods=["PUT"])
@authenticated
def update_student(student_id):
    """Updates an existing student profile."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Request payload must be valid JSON."}), 400

        validated_data = validate_student_data(data, is_update=True)
        col = get_students_collection()

        existing = g.student

        target_id = existing.get("id", student_id)
        col.update_one({"id": target_id}, {"$set": validated_data})

        updated_student = col.find_one({"id": target_id})
        return jsonify({
            "status": "success",
            "message": "Student updated successfully.",
            "data": serialize_student(updated_student)
        }), 200
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("/<student_id>", methods=["DELETE"])
@authenticated
def delete_student(student_id):
    return jsonify({"status": "error", "message": "Account deletion is not available through this endpoint."}), 405

@student_bp.route("/reset", methods=["POST"])
def reset_seed_students():
    return jsonify({"status": "error", "message": "Dataset reset has been disabled."}), 405
