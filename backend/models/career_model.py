"""
Career Role Model & Schema Validation.
"""

from typing import Dict, Any, List

def validate_career_role(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validates career role creation or update payload."""
    if not isinstance(data, dict):
        raise ValueError("Career role data must be a valid JSON object.")

    title = str(data.get("title", "")).strip()
    if not title:
        raise ValueError("Career role 'title' is required.")

    role_id = str(data.get("id", "")).strip().lower().replace(" ", "_")
    if not role_id:
        role_id = title.lower().replace(" ", "_")

    core_skills = data.get("core_skills", [])
    if isinstance(core_skills, str):
        core_skills = [s.strip() for s in core_skills.split(",") if s.strip()]
    elif not isinstance(core_skills, list):
        core_skills = []

    if not core_skills:
        raise ValueError("At least one core skill is required for a career role.")

    advanced_skills = data.get("advanced_skills", [])
    if isinstance(advanced_skills, str):
        advanced_skills = [s.strip() for s in advanced_skills.split(",") if s.strip()]
    elif not isinstance(advanced_skills, list):
        advanced_skills = []

    return {
        "id": role_id,
        "title": title,
        "category": str(data.get("category", "General Engineering")).strip(),
        "description": str(data.get("description", "")).strip(),
        "core_skills": core_skills,
        "advanced_skills": advanced_skills,
        "learning_resources": data.get("learning_resources", []),
        "project_ideas": data.get("project_ideas", [])
    }

def serialize_career_role(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Converts MongoDB document to JSON-safe dictionary."""
    if not doc:
        return {}
    res = dict(doc)
    if "_id" in res:
        del res["_id"]
    return res
