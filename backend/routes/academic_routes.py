"""
Academic Audit REST API Routes (/api/academic).
Provides statistical performance audit, GPA calculation, strong/weak subjects, and attendance health.
"""

from flask import Blueprint, jsonify
from database.db import get_students_collection
from services.academic_service import audit_academic_performance
from models.student_model import serialize_student
from auth import authenticated

academic_bp = Blueprint("academic", __name__, url_prefix="/api/academic")

@academic_bp.route("/audit/<student_id>", methods=["GET"])
@authenticated
def get_academic_audit(student_id):
    """Executes automated academic audit on student record."""
    try:
        col = get_students_collection()
        from flask import g
        student = g.student
        if not student:
            return jsonify({"status": "error", "message": f"Student '{student_id}' not found."}), 404

        student_dict = serialize_student(student)
        audit_result = audit_academic_performance(student_dict)

        return jsonify({
            "status": "success",
            "student": {
                "id": student_dict.get("id"),
                "name": student_dict.get("name"),
                "roll_number": student_dict.get("roll_number"),
                "semester": student_dict.get("semester"),
                "department": student_dict.get("department")
            },
            "audit": audit_result
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
