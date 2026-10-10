"""
Student Model & Schema Validation.
"""

from typing import Dict, Any, List, Optional

def validate_student_data(data: Dict[str, Any], is_update: bool = False) -> Dict[str, Any]:
    """
    Validates and cleans student input data.
    Raises ValueError if mandatory fields are missing or invalid.
    """
    if not isinstance(data, dict):
        raise ValueError("Student data must be a valid JSON object.")

    if not is_update:
        required_fields = ["name", "roll_number", "semester"]
        for field in required_fields:
            if field not in data or data[field] is None:
                raise ValueError(f"Field '{field}' is required.")

    cleaned = {}

    if "id" in data:
        cleaned["id"] = str(data["id"]).strip()
    if "name" in data:
        name = str(data["name"]).strip()
        if len(name) < 2:
            raise ValueError("Student name must be at least 2 characters long.")
        cleaned["name"] = name
    if "roll_number" in data:
        roll = str(data["roll_number"]).strip().upper()
        if not roll:
            raise ValueError("Roll number cannot be empty.")
        cleaned["roll_number"] = roll
    if "email" in data:
        cleaned["email"] = str(data["email"]).strip().lower()
    if "semester" in data:
        try:
            sem = int(data["semester"])
            if sem < 1 or sem > 12:
                raise ValueError("Semester must be between 1 and 12.")
            cleaned["semester"] = sem
        except ValueError:
            raise ValueError("Semester must be a valid integer.")
    if "department" in data:
        cleaned["department"] = str(data.get("department", "Computer Science & Engineering")).strip()
    if "target_role" in data:
        cleaned["target_role"] = str(data.get("target_role", "full_stack_dev")).strip()
    if "attendance_percentage" in data:
        try:
            att = float(data["attendance_percentage"])
            if att < 0 or att > 100:
                raise ValueError("Attendance percentage must be between 0 and 100.")
            cleaned["attendance_percentage"] = round(att, 2)
        except ValueError:
            raise ValueError("Attendance percentage must be a valid number.")

    if "technical_skills" in data:
        skills = data["technical_skills"]
        if isinstance(skills, list):
            cleaned["technical_skills"] = [str(s).strip() for s in skills if str(s).strip()]
        elif isinstance(skills, str):
            cleaned["technical_skills"] = [s.strip() for s in skills.split(",") if s.strip()]
        else:
            cleaned["technical_skills"] = []

    if "completed_courses" in data:
        courses = data["completed_courses"]
        if isinstance(courses, list):
            cleaned["completed_courses"] = [str(c).strip() for c in courses if str(c).strip()]
        elif isinstance(courses, str):
            cleaned["completed_courses"] = [c.strip() for c in courses.split(",") if c.strip()]
        else:
            cleaned["completed_courses"] = []

    if "subjects" in data:
        raw_subjects = data["subjects"]
        if not isinstance(raw_subjects, list):
            cleaned["subjects"] = []
        else:
            valid_subjects = []
            for s in raw_subjects:
                if not isinstance(s, dict):
                    continue
                name = str(s.get("name", "")).strip()
                if not name:
                    continue
                try:
                    marks = float(s.get("marks", 0))
                    if marks < 0 or marks > 100:
                        raise ValueError(f"Marks for '{name}' must be between 0 and 100.")
                except ValueError:
                    raise ValueError(f"Invalid marks value for subject '{name}'.")
                
                credits_val = int(s.get("credits", 3))
                code = str(s.get("code", "")).strip() or name[:4].upper()

                valid_subjects.append({
                    "code": code,
                    "name": name,
                    "marks": marks,
                    "credits": credits_val
                })
            
            cleaned["subjects"] = valid_subjects

    return cleaned

def serialize_student(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Converts MongoDB document to JSON-safe dictionary."""
    if not doc:
        return {}
    res = dict(doc)
    if "_id" in res:
        if "id" not in res:
            res["id"] = str(res["_id"])
        del res["_id"]
    res.pop("password_hash", None)
    res.pop("_neha_account_initialized", None)
    return res
