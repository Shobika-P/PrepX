"""
Personalized Recommendations API Routes (/api/recommendations).
Combines academic audit and skill gap findings into actionable remediation and career roadmaps.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection, get_careers_collection
from services.academic_service import audit_academic_performance
from services.skill_gap_service import analyze_skill_gap
from services.recommendation_service import generate_personalized_recommendations, generate_ai_enhanced_insights
from models.student_model import serialize_student
from models.career_model import serialize_career_role
from auth import authenticated

rec_bp = Blueprint("recommendations", __name__, url_prefix="/api/recommendations")

@rec_bp.route("/<student_id>", methods=["GET"])
@authenticated
def get_recommendations(student_id):
    """
    Generates tailored academic and career recommendations for a student.
    Query param ?role=<role_id> allows overriding target career path.
    """
    try:
        students_col = get_students_collection()
        careers_col = get_careers_collection()

        from flask import g
        student = g.student
        if not student:
            return jsonify({"status": "error", "message": f"Student '{student_id}' not found."}), 404

        student_dict = serialize_student(student)
        role_id = request.args.get("role") or student_dict.get("target_role")

        career_role = careers_col.find_one({"id": role_id})
        if not career_role:
            return jsonify({"status": "error", "message": "Selected career role is not configured."}), 404
        career_dict = serialize_career_role(career_role)

        # Run Audits
        academic_audit = audit_academic_performance(student_dict)
        skill_gap = analyze_skill_gap(student_dict.get("technical_skills", []), career_dict)

        recommendations_data = generate_personalized_recommendations(
            student_dict, academic_audit, skill_gap
        )

        ai_meta = generate_ai_enhanced_insights(student_dict)

        return jsonify({
            "status": "success",
            "student": {
                "id": student_dict.get("id"),
                "name": student_dict.get("name"),
                "roll_number": student_dict.get("roll_number"),
                "semester": student_dict.get("semester")
            },
            "career_role": {
                "id": career_dict.get("id"),
                "title": career_dict.get("title")
            },
            "recommendations": recommendations_data,
            "ai_insights": ai_meta
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
