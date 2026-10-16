"""
Unified Student Report Routes (/api/reports).
Generates unified, printable and export-ready academic audit and skill gap transcripts.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection, get_careers_collection, get_assessment_attempts_collection, is_connected_to_mongo
from services.academic_service import audit_academic_performance
from services.skill_gap_service import analyze_skill_gap, incorporate_assessment_results
from services.recommendation_service import generate_personalized_recommendations
from models.student_model import serialize_student
from models.career_model import serialize_career_role
from auth import authenticated
from datetime import datetime, timezone

report_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

@report_bp.route("/student/<student_id>", methods=["GET"])
@authenticated
def get_unified_student_report(student_id):
    """
    Generates a consolidated holistic student dossier containing:
    1. Student Demographics & Profile
    2. Academic Performance Audit (Pandas statistics, GPA, strengths, weaknesses)
    3. Career Skill Gap Analysis
    4. Actionable Remediation & Growth Recommendations
    5. Database connection metadata
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
        attempts = list(get_assessment_attempts_collection().find(
            {"student_id": student_dict.get("id"), "career_role_id": role_id}
        ).sort("created_at", -1))
        skill_gap = incorporate_assessment_results(skill_gap, attempts)
        recommendations = generate_personalized_recommendations(student_dict, academic_audit, skill_gap)

        return jsonify({
            "status": "success",
            "report_generated_at": datetime.now(timezone.utc).isoformat(),
            "student_profile": student_dict,
            "target_career": career_dict,
            "academic_audit": academic_audit,
            "skill_gap_analysis": skill_gap,
            "recommendations": recommendations,
            "db_mode": "MongoDB Live" if is_connected_to_mongo() else "In-Memory Resilient DB"
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
