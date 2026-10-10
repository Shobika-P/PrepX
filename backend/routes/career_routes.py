"""
Career Roles Management Routes (/api/careers).
Provides career role profiles, required competencies, and learning roadmaps.
"""

from flask import Blueprint, request, jsonify
from database.db import get_careers_collection
from models.career_model import validate_career_role, serialize_career_role

career_bp = Blueprint("careers", __name__, url_prefix="/api/careers")

@career_bp.route("/roles", methods=["GET"])
def get_all_career_roles():
    """Returns all available career role definitions."""
    try:
        col = get_careers_collection()
        roles = list(col.find({}))
        serialized = [serialize_career_role(r) for r in roles]
        return jsonify({"status": "success", "count": len(serialized), "data": serialized}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@career_bp.route("/roles/<role_id>", methods=["GET"])
def get_career_role_by_id(role_id):
    """Fetches a specific career role profile."""
    try:
        col = get_careers_collection()
        role = col.find_one({"id": role_id})
        if not role:
            return jsonify({"status": "error", "message": f"Career role '{role_id}' not found."}), 404
        return jsonify({"status": "success", "data": serialize_career_role(role)}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@career_bp.route("/roles", methods=["POST"])
def add_career_role():
    """Adds a new career role definition."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Request payload must be valid JSON."}), 400

        validated_role = validate_career_role(data)
        col = get_careers_collection()

        existing = col.find_one({"id": validated_role["id"]})
        if existing:
            return jsonify({"status": "error", "message": f"Career role '{validated_role['id']}' already exists."}), 409

        col.insert_one(validated_role)
        return jsonify({
            "status": "success",
            "message": "Career role created successfully.",
            "data": serialize_career_role(validated_role)
        }), 201
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
