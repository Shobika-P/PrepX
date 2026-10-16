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
        email = str(data["email"]).strip().lower()
        if email and ("@" not in email or "." not in email.rsplit("@", 1)[-1]):
            raise ValueError("Enter a valid email address.")
        cleaned["email"] = email
    for field in ("college", "degree", "year", "primary_goal", "learning_timeframe"):
        if field in data:
            cleaned[field] = str(data[field]).strip()
    if "cgpa" in data and data["cgpa"] not in (None, ""):
        try:
            cgpa = float(data["cgpa"])
            if cgpa < 0 or cgpa > 10:
                raise ValueError
            cleaned["cgpa"] = round(cgpa, 2)
        except (ValueError, TypeError):
            raise ValueError("CGPA must be between 0 and 10.")
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
    for field in ("projects", "certifications", "internships", "preferred_skills", "roadmap_progress"):
        if field in data:
            value = data[field]
            cleaned[field] = [str(item).strip() for item in value if str(item).strip()] if isinstance(value, list) else []
    if "career_goal" in data and isinstance(data["career_goal"], dict):
        cleaned["career_goal"] = data["career_goal"]

    if "subjects" in data:
        raw_subjects = data["subjects"]
        if not isinstance(raw_subjects, list):
            raise ValueError("Subjects must be provided as a list of records.")
        else:
            valid_subjects = []
            seen_codes = set()
            seen_names = set()
            for s in raw_subjects:
                if not isinstance(s, dict):
                    raise ValueError("Each subject must be a valid record.")
                name = str(s.get("name", "")).strip()
                if not name:
                    raise ValueError("Every subject must have a name.")
                if s.get("marks") in (None, ""):
                    raise ValueError(f"Marks are required for '{name}'.")
                try:
                    if isinstance(s.get("marks"), bool):
                        raise ValueError
                    marks = float(s.get("marks", 0))
                    if marks < 0 or marks > 100:
                        raise ValueError(f"Marks for '{name}' must be between 0 and 100.")
                except ValueError:
                    raise ValueError(f"Invalid marks value for subject '{name}'.")
                
                try:
                    credits_val = int(s.get("credits", 3))
                except (ValueError, TypeError):
                    raise ValueError(f"Credits for '{name}' must be a whole number from 1 to 30.")
                if credits_val < 1 or credits_val > 30:
                    raise ValueError(f"Credits for '{name}' must be a whole number from 1 to 30.")
                code = str(s.get("code", "")).strip() or name[:4].upper()
                norm_code, norm_name = code.casefold(), name.casefold()
                if norm_code in seen_codes or norm_name in seen_names:
                    raise ValueError(f"Duplicate subject code or name found for '{name}'.")
                seen_codes.add(norm_code)
                seen_names.add(norm_name)

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
    res.pop("token", None)
    return res
