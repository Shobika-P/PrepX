"""
Student Data Management Routes (/api/students).
Provides CRUD endpoints and data management for student profiles.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection, db_manager
from models.student_model import validate_student_data, serialize_student
import uuid

student_bp = Blueprint("students", __name__, url_prefix="/api/students")

@student_bp.route("", methods=["GET"])
def get_all_students():
    """Returns list of all students."""
    try:
        col = get_students_collection()
        students = list(col.find({}))
        serialized = [serialize_student(s) for s in students]
        return jsonify({"status": "success", "count": len(serialized), "data": serialized}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("/<student_id>", methods=["GET"])
def get_student_by_id(student_id):
    """Fetches a specific student by ID or roll number."""
    try:
        col = get_students_collection()
        student = col.find_one({"$or": [{"id": student_id}, {"roll_number": student_id}]})
        if not student:
            return jsonify({"status": "error", "message": f"Student with ID/Roll '{student_id}' not found."}), 404
        return jsonify({"status": "success", "data": serialize_student(student)}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("", methods=["POST"])
def create_student():
    """Creates a new student record."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Request payload must be valid JSON."}), 400

        validated_data = validate_student_data(data, is_update=False)
        col = get_students_collection()

        # Check if roll number already exists
        existing = col.find_one({"roll_number": validated_data["roll_number"]})
        if existing:
            return jsonify({"status": "error", "message": f"Student with Roll Number '{validated_data['roll_number']}' already exists."}), 409

        if "id" not in validated_data or not validated_data["id"]:
            validated_data["id"] = f"STU_{uuid.uuid4().hex[:6].upper()}"

        col.insert_one(validated_data)
        return jsonify({
            "status": "success",
            "message": "Student created successfully.",
            "data": serialize_student(validated_data)
        }), 201
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("/<student_id>", methods=["PUT"])
def update_student(student_id):
    """Updates an existing student profile."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Request payload must be valid JSON."}), 400

        validated_data = validate_student_data(data, is_update=True)
        col = get_students_collection()

        existing = col.find_one({"$or": [{"id": student_id}, {"roll_number": student_id}]})
        if not existing:
            return jsonify({"status": "error", "message": f"Student '{student_id}' not found."}), 404

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
def delete_student(student_id):
    """Deletes a student record."""
    try:
        col = get_students_collection()
        res = col.delete_one({"$or": [{"id": student_id}, {"roll_number": student_id}]})
        if res.deleted_count == 0:
            return jsonify({"status": "error", "message": f"Student '{student_id}' not found."}), 404

        return jsonify({"status": "success", "message": "Student deleted successfully."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@student_bp.route("/reset", methods=["POST"])
def reset_seed_students():
    """Resets database back to default sample dataset."""
    try:
        db_manager.reset_seed_data()
        return jsonify({"status": "success", "message": "Database reset to initial seed data successfully."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
