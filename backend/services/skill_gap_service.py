"""
Skill-Gap Analysis Engine.
Compares a student's current technical competencies against industry career role requirements,
calculates readiness percentage, and identifies missing skills.
"""

from typing import Dict, Any, List, Set

# Skill normalization mapping for robust matching
SKILL_ALIASES = {
    "react.js": "react",
    "reactjs": "react",
    "node": "node.js",
    "nodejs": "node.js",
    "express": "express.js",
    "expressjs": "express.js",
    "mongo": "mongodb",
    "postgres": "postgresql",
    "postgre": "postgresql",
    "py": "python",
    "js": "javascript",
    "ts": "typescript",
    "tailwind": "tailwind css",
    "aws cloud": "aws",
    "gcp cloud": "gcp",
    "k8s": "kubernetes",
    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",
    "tf": "tensorflow",
    "ml": "machine learning basics",
    "stats": "statistics",
    "math": "mathematics & statistics"
}

SKILL_CATEGORIES = {
    "Languages": ["python", "javascript", "typescript", "html", "css", "c++", "java", "sql", "r", "bash"],
    "Frameworks & Libraries": ["react", "node.js", "express.js", "next.js", "redux", "tailwind css", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "fastapi", "flask"],
    "Databases & Storage": ["mongodb", "postgresql", "sql", "redis", "excel"],
    "Cloud & DevOps": ["docker", "kubernetes", "aws", "gcp", "ci/cd", "linux", "terraform", "ansible", "prometheus"],
    "Tools & Concepts": ["git", "rest apis", "graphql", "responsive design", "figma", "power bi", "tableau", "system design", "microservices", "deep learning", "statistics", "data visualization", "mathematics & statistics"]
}

def normalize_skill(skill: str) -> str:
    """Normalizes skill string for accurate case-insensitive matching."""
    s = skill.strip().lower()
    return SKILL_ALIASES.get(s, s)

def categorize_skill(skill: str) -> str:
    """Determines high-level technology category for a given skill."""
    norm = normalize_skill(skill)
    for category, skills in SKILL_CATEGORIES.items():
        if norm in skills:
            return category
    return "Other Competencies"

def analyze_skill_gap(student_skills: List[str], career_role: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performs full skill-gap audit comparing student's skills with the career role profile.
    """
    if not isinstance(student_skills, list):
        student_skills = []

    # Normalized lookup set for student
    norm_student_skills_map = {normalize_skill(s): s for s in student_skills}
    student_norm_set = set(norm_student_skills_map.keys())

    core_skills_raw = career_role.get("core_skills", [])
    advanced_skills_raw = career_role.get("advanced_skills", [])

    # Core Skills Evaluation
    acquired_core = []
    missing_core = []
    for skill in core_skills_raw:
        norm = normalize_skill(skill)
        if norm in student_norm_set:
            acquired_core.append({
                "name": skill,
                "category": categorize_skill(skill),
                "status": "Acquired",
                "is_core": True
            })
        else:
            missing_core.append({
                "name": skill,
                "category": categorize_skill(skill),
                "status": "Missing",
                "is_core": True
            })

    # Advanced Skills Evaluation
    acquired_advanced = []
    missing_advanced = []
    for skill in advanced_skills_raw:
        norm = normalize_skill(skill)
        if norm in student_norm_set:
            acquired_advanced.append({
                "name": skill,
                "category": categorize_skill(skill),
                "status": "Acquired",
                "is_core": False
            })
        else:
            missing_advanced.append({
                "name": skill,
                "category": categorize_skill(skill),
                "status": "Missing",
                "is_core": False
            })

    total_core = len(core_skills_raw)
    total_advanced = len(advanced_skills_raw)
    num_acquired_core = len(acquired_core)
    num_acquired_advanced = len(acquired_advanced)

    # Core Skill Match %
    core_match_percentage = round((num_acquired_core / total_core * 100), 1) if total_core > 0 else 0.0

    # Weighted Overall Readiness Score
    # Core skills carry 75% weight, Advanced skills carry 25% weight
    advanced_match_percentage = round((num_acquired_advanced / total_advanced * 100), 1) if total_advanced > 0 else 0.0
    overall_readiness_score = round(
        (0.75 * core_match_percentage) + (0.25 * advanced_match_percentage), 1
    )

    # Readiness Rating Classification
    if overall_readiness_score >= 85:
        readiness_level = "Job Ready / Advanced"
        readiness_badge = "Excellent"
        readiness_color = "emerald"
    elif overall_readiness_score >= 65:
        readiness_level = "Internship Ready / Moderate Gap"
        readiness_badge = "Good"
        readiness_color = "blue"
    elif overall_readiness_score >= 40:
        readiness_level = "Foundation Built / Substantial Gap"
        readiness_badge = "Intermediate"
        readiness_color = "amber"
    else:
        readiness_level = "Novice / Significant Skill Gap"
        readiness_badge = "Beginner"
        readiness_color = "rose"

    # Category-based breakdown
    categories_breakdown = {}
    for cat in SKILL_CATEGORIES.keys():
        categories_breakdown[cat] = {
            "total": 0,
            "acquired": 0,
            "missing": 0,
            "skills": []
        }

    all_role_skills = acquired_core + missing_core + acquired_advanced + missing_advanced
    for item in all_role_skills:
        cat = item["category"]
        if cat not in categories_breakdown:
            categories_breakdown[cat] = {"total": 0, "acquired": 0, "missing": 0, "skills": []}
        
        categories_breakdown[cat]["total"] += 1
        if item["status"] == "Acquired":
            categories_breakdown[cat]["acquired"] += 1
        else:
            categories_breakdown[cat]["missing"] += 1
        categories_breakdown[cat]["skills"].append(item)

    # Extra skills student has that aren't in this role
    role_norm_skills = {normalize_skill(s) for s in (core_skills_raw + advanced_skills_raw)}
    extra_student_skills = [
        s for s in student_skills if normalize_skill(s) not in role_norm_skills
    ]

    return {
        "role_id": career_role.get("id"),
        "role_title": career_role.get("title"),
        "role_category": career_role.get("category"),
        "role_description": career_role.get("description"),
        "total_core_skills": total_core,
        "total_advanced_skills": total_advanced,
        "acquired_core_count": num_acquired_core,
        "missing_core_count": len(missing_core),
        "acquired_advanced_count": num_acquired_advanced,
        "missing_advanced_count": len(missing_advanced),
        "core_match_percentage": core_match_percentage,
        "advanced_match_percentage": advanced_match_percentage,
        "overall_readiness_score": overall_readiness_score,
        "readiness_level": readiness_level,
        "readiness_badge": readiness_badge,
        "readiness_color": readiness_color,
        "acquired_core_skills": acquired_core,
        "missing_core_skills": missing_core,
        "acquired_advanced_skills": acquired_advanced,
        "missing_advanced_skills": missing_advanced,
        "categories_breakdown": categories_breakdown,
        "extra_student_skills": extra_student_skills,
        "all_student_skills": student_skills,
        "learning_resources": career_role.get("learning_resources", []),
        "project_ideas": career_role.get("project_ideas", [])
    }
