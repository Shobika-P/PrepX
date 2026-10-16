"""Authenticated assessment API."""
from flask import Blueprint, g, jsonify, request
from pymongo.errors import PyMongoError
from auth import authenticated
from database.db import get_assessment_attempts_collection, get_careers_collection
from services.assessment_service import public_skills, public_questions, score_submission, create_attempt

assessment_bp = Blueprint("assessments", __name__, url_prefix="/api/assessments")

def current_role():
    role_id = g.student.get("target_role") or (g.student.get("career_goal") or {}).get("target_role")
    return get_careers_collection().find_one({"id": role_id}) if role_id else None

def student_attempts(role_id=None):
    query = {"student_id": g.student["id"]}
    if role_id:
        query["career_role_id"] = role_id
    return list(get_assessment_attempts_collection().find(query).sort("created_at", -1))

@assessment_bp.get("/skills")
@authenticated
def skills():
    role = current_role()
    if not role:
        return jsonify({"status":"error", "message":"Choose a configured career role in your profile first."}), 400
    return jsonify({"status":"success", "role":{"id":role.get("id"),"title":role.get("title")}, "data":public_skills(role, student_attempts(role.get("id")))}), 200

@assessment_bp.get("/<skill_id>/questions")
@authenticated
def questions(skill_id):
    role = current_role()
    try: level = int(request.args.get("level", "1"))
    except ValueError: return jsonify({"status":"error", "message":"Assessment level must be 1, 2, or 3."}), 400
    available = {s["id"]:s for s in public_skills(role, student_attempts(role.get("id")))} if role else {}
    skill_progress = available.get(skill_id)
    data = public_questions(skill_id, level) if skill_progress and level <= skill_progress["unlocked_level"] else None
    if data is None:
        return jsonify({"status":"error", "message":"This assessment level is locked or unavailable for your selected role."}), 404
    return jsonify({"status":"success", "data":data}), 200

@assessment_bp.post("/submit")
@authenticated
def submit():
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or not isinstance(data.get("skill_id"), str):
        return jsonify({"status":"error", "message":"Provide a valid skill_id and answers."}), 400
    role = current_role()
    try: level = data.get("level", 1)
    except AttributeError: level = None
    if isinstance(level, bool) or not isinstance(level, int):
        return jsonify({"status":"error", "message":"Assessment level must be 1, 2, or 3."}), 400
    available = {s["id"]:s for s in public_skills(role, student_attempts(role.get("id")))} if role else {}
    if data["skill_id"] not in available:
        return jsonify({"status":"error", "message":"Assessment skill is unavailable for your selected role."}), 400
    if level not in (1, 2, 3) or level > available[data["skill_id"]]["unlocked_level"]:
        return jsonify({"status":"error", "message":"Complete the previous level with at least 60% to unlock this level."}), 400
    try:
        result = score_submission(data["skill_id"], level, data.get("answers"))
        attempt = create_attempt(g.student["id"], role, data["skill_id"], level, data["answers"], result)
        get_assessment_attempts_collection().insert_one(attempt)
        attempt.pop("_id", None)
        return jsonify({"status":"success", "result":attempt}), 201
    except ValueError as exc:
        return jsonify({"status":"error", "message":str(exc)}), 400
    except PyMongoError:
        return jsonify({"status":"error", "message":"Could not save assessment result."}), 503

@assessment_bp.get("/history")
@authenticated
def history():
    try:
        attempts = student_attempts()
        for item in attempts: item.pop("_id", None)
        return jsonify({"status":"success", "data":attempts}), 200
    except PyMongoError:
        return jsonify({"status":"error", "message":"Could not load assessment history."}), 503

@assessment_bp.get("/results/<attempt_id>")
@authenticated
def result(attempt_id):
    try:
        item = get_assessment_attempts_collection().find_one({"attempt_id":attempt_id, "student_id":g.student["id"]})
        if not item: return jsonify({"status":"error", "message":"Assessment result not found."}), 404
        item.pop("_id", None)
        return jsonify({"status":"success", "result":item}), 200
    except PyMongoError:
        return jsonify({"status":"error", "message":"Could not load assessment result."}), 503
