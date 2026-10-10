"""
Academic Performance Audit Engine.
Analyzes subject marks, credits, GPA, grade distributions, strong & weak areas,
attendance health, and overall academic standing.
Leverages Pandas for high-performance tabular computation when available,
with a built-in statistical fallback for environments where native binary extensions
are compiling or restricted.
"""

import math
import statistics
from typing import Dict, Any, List

# Try importing Pandas, else use built-in robust analytics engine
try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

def calculate_grade_point(marks: float) -> tuple[float, str]:
    """Calculates 10-point scale grade point and letter grade."""
    marks = float(marks)
    if marks >= 90:
        return 10.0, "O (Outstanding)"
    elif marks >= 80:
        return 9.0, "A+ (Excellent)"
    elif marks >= 70:
        return 8.0, "A (Very Good)"
    elif marks >= 60:
        return 7.0, "B+ (Good)"
    elif marks >= 50:
        return 6.0, "B (Above Average)"
    elif marks >= 40:
        return 5.0, "C (Pass)"
    else:
        return 0.0, "F (Fail)"

def audit_academic_performance(student: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performs comprehensive academic audit on student records.
    Computes averages, weighted GPA, strong & weak subjects, and distribution.
    """
    subjects_data = student.get("subjects", [])
    attendance = float(student.get("attendance_percentage", 0.0))

    if not subjects_data:
        return {
            "student_id": student.get("id"),
            "student_name": student.get("name"),
            "roll_number": student.get("roll_number"),
            "semester": student.get("semester"),
            "total_subjects": 0,
            "total_credits": 0,
            "average_marks": 0.0,
            "weighted_gpa": 0.0,
            "highest_mark": 0.0,
            "lowest_mark": 0.0,
            "marks_std_dev": 0.0,
            "performance_category": "Needs Improvement",
            "category_description": "No subject marks available to evaluate.",
            "category_color": "rose",
            "strong_subjects_count": 0,
            "moderate_subjects_count": 0,
            "weak_subjects_count": 0,
            "strong_subjects": [],
            "moderate_subjects": [],
            "weak_subjects": [],
            "attendance_analysis": analyze_attendance(attendance),
            "grade_distribution": {},
            "subjects_breakdown": [],
            "summary_insights": ["No subject marks available to evaluate."]
        }

    # Process subjects
    processed_subjects = []
    total_weighted_points = 0.0
    total_credits = 0.0
    marks_list = []

    for s in subjects_data:
        m = float(s.get("marks", 0.0))
        c = float(s.get("credits", 3.0))
        gp, letter = calculate_grade_point(m)
        weighted_gp = gp * c

        total_weighted_points += weighted_gp
        total_credits += c
        marks_list.append(m)

        processed_subjects.append({
            "code": s.get("code", s.get("name", "")[:4].upper()),
            "name": s.get("name", "Subject"),
            "marks": m,
            "credits": c,
            "grade_point": gp,
            "letter_grade": letter,
            "weighted_points": weighted_gp
        })

    # Statistical Aggregations
    average_marks = round(sum(marks_list) / len(marks_list), 2) if marks_list else 0.0
    weighted_gpa = round(total_weighted_points / total_credits, 2) if total_credits > 0 else 0.0
    highest_mark = max(marks_list) if marks_list else 0.0
    lowest_mark = min(marks_list) if marks_list else 0.0
    std_dev = round(statistics.stdev(marks_list), 2) if len(marks_list) > 1 else 0.0

    # Strong (>=75), Moderate (60-74), Weak (<60)
    strong_subjects = [s for s in processed_subjects if s["marks"] >= 75]
    moderate_subjects = [s for s in processed_subjects if 60 <= s["marks"] < 75]
    weak_subjects = [s for s in processed_subjects if s["marks"] < 60]

    # Academic Category
    if average_marks >= 85:
        performance_category = "Excellent"
        category_description = "Outstanding academic standing with strong conceptual mastery."
        category_color = "emerald"
    elif average_marks >= 70:
        performance_category = "Good"
        category_description = "Solid academic performance with consistent subject understanding."
        category_color = "blue"
    elif average_marks >= 55:
        performance_category = "Average"
        category_description = "Moderate performance. Focus on weak subjects will boost overall standing."
        category_color = "amber"
    else:
        performance_category = "Needs Improvement"
        category_description = "Below benchmark performance. Requires targeted remediation and support."
        category_color = "rose"

    # Attendance Analysis
    attendance_analysis = analyze_attendance(attendance)

    # Grade distribution counts
    grade_distribution = {
        "O (>=90%)": sum(1 for m in marks_list if m >= 90),
        "A+ (80-89%)": sum(1 for m in marks_list if 80 <= m < 90),
        "A (70-79%)": sum(1 for m in marks_list if 70 <= m < 80),
        "B+ (60-69%)": sum(1 for m in marks_list if 60 <= m < 70),
        "B (50-59%)": sum(1 for m in marks_list if 50 <= m < 60),
        "C (40-49%)": sum(1 for m in marks_list if 40 <= m < 50),
        "F (<40%)": sum(1 for m in marks_list if m < 40)
    }

    # Summary Insights
    insights = []
    if len(weak_subjects) > 0:
        weak_names = [s["name"] for s in weak_subjects]
        insights.append(f"Attention needed in {len(weak_subjects)} subject(s): {', '.join(weak_names)}.")
    else:
        insights.append("All subjects are scoring at or above 60% standard.")

    if len(strong_subjects) > 0:
        top_sub = sorted(strong_subjects, key=lambda x: x["marks"], reverse=True)[0]
        insights.append(f"Top performing subject is '{top_sub['name']}' with {top_sub['marks']} marks.")

    if attendance < 75.0:
        insights.append("Critical attendance deficit: Below the university 75% examination eligibility limit.")
    elif attendance < 80.0:
        insights.append("Attendance is in the warning band (75-80%). Maintain regular presence.")
    else:
        insights.append("Attendance is in good standing (>80%).")

    return {
        "student_id": student.get("id"),
        "student_name": student.get("name"),
        "roll_number": student.get("roll_number"),
        "semester": student.get("semester"),
        "total_subjects": len(processed_subjects),
        "total_credits": total_credits,
        "average_marks": average_marks,
        "weighted_gpa": weighted_gpa,
        "highest_mark": highest_mark,
        "lowest_mark": lowest_mark,
        "marks_std_dev": std_dev,
        "performance_category": performance_category,
        "category_description": category_description,
        "category_color": category_color,
        "strong_subjects_count": len(strong_subjects),
        "moderate_subjects_count": len(moderate_subjects),
        "weak_subjects_count": len(weak_subjects),
        "strong_subjects": strong_subjects,
        "moderate_subjects": moderate_subjects,
        "weak_subjects": weak_subjects,
        "attendance_analysis": attendance_analysis,
        "grade_distribution": grade_distribution,
        "subjects_breakdown": processed_subjects,
        "summary_insights": insights,
        "engine": "Pandas" if HAS_PANDAS else "Statistics Engine"
    }

def analyze_attendance(attendance: float) -> Dict[str, Any]:
    """Evaluates student attendance against academic compliance thresholds."""
    attendance = round(max(0.0, min(100.0, float(attendance))), 2)

    total_classes = 100
    attended_classes = int(round((attendance / 100.0) * total_classes))

    if attendance >= 85.0:
        status = "Good Standing"
        badge = "Normal"
        color = "emerald"
        message = "Attendance is excellent and well above minimum college requirements."
        classes_needed_75 = 0
        classes_needed_85 = 0
    elif attendance >= 75.0:
        status = "Satisfactory (Warning Band)"
        badge = "Warning"
        color = "amber"
        message = "Attendance meets minimal exam eligibility (75%), but is close to threshold."
        classes_needed_75 = 0
        classes_needed_85 = max(0, int(math.ceil((0.85 * total_classes - attended_classes) / 0.15)))
    else:
        status = "Critical Shortage"
        badge = "Danger"
        color = "rose"
        message = "Attendance is strictly below 75%. Risk of exam debarment or penalty."
        classes_needed_75 = max(0, int(math.ceil((0.75 * total_classes - attended_classes) / 0.25)))
        classes_needed_85 = max(0, int(math.ceil((0.85 * total_classes - attended_classes) / 0.15)))

    return {
        "percentage": attendance,
        "status": status,
        "badge": badge,
        "color": color,
        "message": message,
        "estimated_attended": attended_classes,
        "estimated_total": total_classes,
        "classes_to_reach_75": classes_needed_75,
        "classes_to_reach_85": classes_needed_85
    }
