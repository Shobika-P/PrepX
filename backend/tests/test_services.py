"""
Unit Tests for AI Campus Companion Core Business Logic & Services.
"""

import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from services.academic_service import audit_academic_performance, analyze_attendance, calculate_grade_point
from services.skill_gap_service import analyze_skill_gap, normalize_skill, incorporate_assessment_results
from services.recommendation_service import generate_personalized_recommendations
from models.student_model import validate_student_data
from services.assessment_service import QUESTION_BANK, proficiency, public_questions, score_submission

def test_calculate_grade_point():
    assert calculate_grade_point(95)[0] == 10.0
    assert calculate_grade_point(85)[0] == 9.0
    assert calculate_grade_point(75)[0] == 8.0
    assert calculate_grade_point(65)[0] == 7.0
    assert calculate_grade_point(55)[0] == 6.0
    assert calculate_grade_point(45)[0] == 5.0
    assert calculate_grade_point(35)[0] == 0.0

def test_attendance_analysis():
    good = analyze_attendance(90.0)
    assert good["badge"] == "Normal"
    assert good["classes_to_reach_75"] == 0

    warning = analyze_attendance(78.0)
    assert warning["badge"] == "Warning"

    critical = analyze_attendance(65.0)
    assert critical["badge"] == "Danger"
    assert critical["classes_to_reach_75"] > 0

def test_academic_audit_service():
    sample_student = {
        "id": "STU_TEST",
        "name": "Test Student",
        "roll_number": "21CS999",
        "semester": 6,
        "attendance_percentage": 82.0,
        "subjects": [
            {"code": "CS101", "name": "Subject A", "marks": 90, "credits": 4},
            {"code": "CS102", "name": "Subject B", "marks": 50, "credits": 4},
            {"code": "CS103", "name": "Subject C", "marks": 80, "credits": 3}
        ]
    }
    
    audit = audit_academic_performance(sample_student)
    assert audit["total_subjects"] == 3
    assert audit["total_credits"] == 11
    # Average: (90 + 50 + 80) / 3 = 73.33
    assert 73.0 <= audit["average_marks"] <= 74.0
    assert len(audit["strong_subjects"]) == 2  # 90 and 80 are >= 75
    assert len(audit["weak_subjects"]) == 1    # 50 is < 60
    assert audit["performance_category"] == "Good"

def test_skill_gap_service():
    student_skills = ["HTML", "CSS", "JavaScript", "Python"]
    career_role = {
        "id": "full_stack_dev",
        "title": "Full-Stack Developer",
        "core_skills": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB", "Git"],
        "advanced_skills": ["TypeScript", "Docker"]
    }

    gap = analyze_skill_gap(student_skills, career_role)
    assert gap["acquired_core_count"] == 3  # HTML, CSS, JavaScript
    assert gap["missing_core_count"] == 5   # React, Node.js, Express.js, MongoDB, Git
    assert gap["core_match_percentage"] == round((3 / 8) * 100, 1)  # 37.5%
    assert gap["readiness_level"] == "Novice / Significant Skill Gap"

def test_assessment_changes_role_readiness_but_unassessed_stays_missing():
    role = {"id":"frontend_dev", "title":"Frontend", "core_skills":["React"], "advanced_skills":[]}
    baseline = analyze_skill_gap([], role)
    assert baseline["overall_readiness_score"] == 0
    passed = incorporate_assessment_results(baseline, [{
        "skill_name":"React", "score_percentage":80, "proficiency":"Advanced",
        "required_level":"Proficient", "needs_improvement":False
    }])
    assert passed["core_match_percentage"] == 100
    assert passed["overall_readiness_score"] == 75
    assert passed["acquired_core_skills"][0]["assessment"]["score_percentage"] == 80
    assert passed["assessed_skills"][0]["skill"] == "React"

def test_recommendation_engine():
    sample_student = {
        "id": "STU_TEST",
        "name": "Test Student",
        "roll_number": "21CS999",
        "semester": 6,
        "attendance_percentage": 70.0,
        "subjects": [
            {"code": "CS102", "name": "Database Management Systems (DBMS)", "marks": 52, "credits": 4}
        ]
    }
    career_role = {
        "id": "full_stack_dev",
        "title": "Full-Stack Developer",
        "core_skills": ["HTML", "React", "Node.js"],
        "advanced_skills": []
    }
    
    audit = audit_academic_performance(sample_student)
    gap = analyze_skill_gap(["HTML"], career_role)
    recs = generate_personalized_recommendations(sample_student, audit, gap)
    
    assert recs["total_recommendations"] > 0
    categories = [r["category"] for r in recs["recommendations"]]
    assert "Academic Remediation" in categories
    assert "Attendance Compliance" in categories
    assert "Career Skill Gap" in categories

def test_student_validation():
    valid = {
        "name": "Jane Doe",
        "roll_number": "22CS101",
        "semester": "4",
        "subjects": [{"name": "Math", "marks": "85", "credits": 4}],
        "attendance_percentage": "88.5"
    }
    cleaned = validate_student_data(valid)
    assert cleaned["name"] == "Jane Doe"
    assert cleaned["semester"] == 4
    assert cleaned["attendance_percentage"] == 88.5
    with pytest.raises(ValueError, match="Duplicate subject code or name"):
        validate_student_data({"subjects":[
            {"code":"CS101","name":"Math","marks":80,"credits":4},
            {"code":"cs101","name":"Statistics","marks":75,"credits":3}
        ]}, is_update=True)
    with pytest.raises(ValueError, match="Marks are required"):
        validate_student_data({"subjects":[{"code":"CS1","name":"Math","marks":"","credits":4}]}, is_update=True)

def test_assessment_questions_hide_answer_keys_and_scoring():
    questions = public_questions("javascript", 1)
    assert len(questions) == 10
    assert all("correct" not in q and "answer" not in q for q in questions)
    answers = [{"question_id": q["id"], "selected_option": 1} for q in questions]
    result = score_submission("javascript", 1, answers)
    assert result["total_questions"] == 10
    assert result["correct_answers"] == 2
    assert result["score_percentage"] == 20
    assert result["proficiency"] == "Beginner"
    assert len(result["question_review"]) == 10

def test_assessment_proficiency_boundaries_and_validation():
    assert [proficiency(score) for score in (0, 39, 40, 59, 60, 79, 80, 100)] == [
        "Beginner", "Beginner", "Developing", "Developing", "Proficient", "Proficient", "Advanced", "Advanced"
    ]
    questions = public_questions("git", 1)
    assert score_submission("git", 1, [{"question_id": q["id"], "selected_option": answer[2]} for q, answer in zip(questions, QUESTION_BANK["git"]["questions"])])["score_percentage"] == 100
    with pytest.raises(ValueError): score_submission("git", 1, [])
    with pytest.raises(ValueError): score_submission("git", 1, [{"question_id": questions[0]["id"], "selected_option": 0}] * 10)
    malformed = [{"question_id": q["id"], "selected_option": 0} for q in questions]
    malformed[0]["selected_option"] = 4
    with pytest.raises(ValueError): score_submission("git", 1, malformed)

def test_assessment_exact_score_boundaries():
    questions = public_questions("git", 2)
    for correct_count in (0, 4, 6, 8, 10):
        answers = []
        for i, question in enumerate(QUESTION_BANK["git"]["questions"]):
            correct_option = question[2]
            option = correct_option if i < correct_count else (correct_option + 1) % 4
            answers.append({"question_id": f"git-L2-{i+1}", "selected_option": option})
        result = score_submission("git", 2, answers)
        assert result["score_percentage"] == correct_count * 10
        assert result["proficiency"] == proficiency(correct_count * 10)

if __name__ == "__main__":
    pytest.main(["-v", __file__])
