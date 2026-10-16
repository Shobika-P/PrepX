"""
Skill Gap Analysis Routes (/api/skills).
Compares student skills with chosen career roles and computes readiness gaps.
"""

from flask import Blueprint, request, jsonify
from database.db import get_students_collection, get_careers_collection, get_assessment_attempts_collection
from services.skill_gap_service import analyze_skill_gap
from models.student_model import serialize_student
from models.career_model import serialize_career_role
from auth import authenticated

skill_bp = Blueprint("skills", __name__, url_prefix="/api/skills")

@skill_bp.route("/gap-analysis/<student_id>", methods=["GET"])
@authenticated
def get_student_skill_gap(student_id):
    """
    Computes skill gap analysis for a student.
    Query param ?role=<role_id> overrides student's default target role.
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
        student_skills = student_dict.get("technical_skills", [])

        analysis_result = analyze_skill_gap(student_skills, career_dict)

        # Assessment bands map directly to the existing role tiers: core = Proficient,
        # advanced = Advanced. Unconfigured role skills remain unavailable.
        attempts = list(get_assessment_attempts_collection().find(
            {"student_id": student_dict.get("id"), "career_role_id": role_id}
        ).sort("created_at", -1))
        latest = {}
        for attempt in attempts:
            latest.setdefault(attempt.get("skill_name", "").lower(), attempt)
        assessment_summary = []
        for item in list(analysis_result["acquired_core_skills"] + analysis_result["missing_core_skills"] +
                         analysis_result["acquired_advanced_skills"] + analysis_result["missing_advanced_skills"]):
            assessed = latest.get(item["name"].lower())
            if assessed:
                item["assessment"] = {"score_percentage": assessed["score_percentage"], "proficiency": assessed["proficiency"],
                                       "required_level": assessed.get("required_level"), "needs_improvement": assessed.get("needs_improvement")}
                item["status"] = "Needs Improvement" if assessed.get("needs_improvement") else "Assessment Meets Requirement"
                assessment_summary.append({"skill": item["name"], **item["assessment"]})
        # Readiness and category visualizations now include verified attempts.
        # For a skill with an assessment, the latest result is authoritative over
        # profile-entered skill names; no unassessed skill is inferred.
        competencies = analysis_result["acquired_core_skills"] + analysis_result["missing_core_skills"] + analysis_result["acquired_advanced_skills"] + analysis_result["missing_advanced_skills"]
        for tier in (True, False):
            tier_items = [item for item in competencies if item["is_core"] == tier]
            for item in tier_items:
                if "assessment" in item:
                    item["status"] = "Missing" if item["assessment"]["needs_improvement"] else "Acquired"
                item["status"] = "Acquired" if item["status"] in ("Acquired", "Assessment Meets Requirement") else "Missing"
            acquired = [item for item in tier_items if item["status"] == "Acquired"]
            missing = [item for item in tier_items if item["status"] == "Missing"]
            analysis_result["acquired_core_skills" if tier else "acquired_advanced_skills"] = acquired
            analysis_result["missing_core_skills" if tier else "missing_advanced_skills"] = missing
            analysis_result["acquired_core_count" if tier else "acquired_advanced_count"] = len(acquired)
            analysis_result["missing_core_count" if tier else "missing_advanced_count"] = len(missing)
            denominator = analysis_result["total_core_skills" if tier else "total_advanced_skills"]
            analysis_result["core_match_percentage" if tier else "advanced_match_percentage"] = round(len(acquired) / denominator * 100, 1) if denominator else 0.0
        analysis_result["overall_readiness_score"] = round(0.75 * analysis_result["core_match_percentage"] + 0.25 * analysis_result["advanced_match_percentage"], 1)
        score = analysis_result["overall_readiness_score"]
        if score >= 85:
            analysis_result.update(readiness_level="Job Ready / Advanced", readiness_badge="Excellent", readiness_color="emerald")
        elif score >= 65:
            analysis_result.update(readiness_level="Internship Ready / Moderate Gap", readiness_badge="Good", readiness_color="blue")
        elif score >= 40:
            analysis_result.update(readiness_level="Foundation Built / Substantial Gap", readiness_badge="Intermediate", readiness_color="amber")
        else:
            analysis_result.update(readiness_level="Novice / Significant Skill Gap", readiness_badge="Beginner", readiness_color="rose")
        for category in analysis_result["categories_breakdown"].values():
            category["acquired"] = sum(skill["status"] == "Acquired" for skill in category["skills"])
            category["missing"] = category["total"] - category["acquired"]
        analysis_result["assessed_skills"] = assessment_summary
        analysis_result["assessment_mapping"] = "PrepX bands: 0–39 Beginner, 40–59 Developing, 60–79 Proficient, 80–100 Advanced. Existing core competencies require Proficient; advanced competencies require Advanced."

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
