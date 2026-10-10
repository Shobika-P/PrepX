"""
Skill Gap Analysis Routes (/api/skills).
Compares student skills with chosen career roles and computes readiness gaps.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection, get_careers_collection
from services.skill_gap_service import analyze_skill_gap
from models.student_model import serialize_student
from models.career_model import serialize_career_role

skill_bp = Blueprint("skills", __name__, url_prefix="/api/skills")

@skill_bp.route("/gap-analysis/<student_id>", methods=["GET"])
def get_student_skill_gap(student_id):
    """
    Computes skill gap analysis for a student.
    Query param ?role=<role_id> overrides student's default target role.
    """
    try:
        students_col = get_students_collection()
        careers_col = get_careers_collection()

        student = students_col.find_one({"$or": [{"id": student_id}, {"roll_number": student_id}]})
        if not student:
            return jsonify({"status": "error", "message": f"Student '{student_id}' not found."}), 404

        student_dict = serialize_student(student)
        role_id = request.args.get("role") or student_dict.get("target_role", "full_stack_dev")

        career_role = careers_col.find_one({"id": role_id})
        if not career_role:
            # Fallback to first available role
            career_role = careers_col.find_one({})
            if not career_role:
                return jsonify({"status": "error", "message": "No career roles configured in the system."}), 404

        career_dict = serialize_career_role(career_role)
        student_skills = student_dict.get("technical_skills", [])

        analysis_result = analyze_skill_gap(student_skills, career_dict)

        return jsonify({
            "status": "success",
            "student": {
                "id": student_dict.get("id"),
                "name": student_dict.get("name"),
                "roll_number": student_dict.get("roll_number"),
                "completed_courses": student_dict.get("completed_courses", [])
            },
            "skill_gap": analysis_result
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
