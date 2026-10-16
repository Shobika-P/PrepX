import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import mongomock
import auth
from app import create_app
from routes import assessment_routes
from services.assessment_service import QUESTION_BANK

def test_assessment_api_hides_keys_saves_and_scopes_results(monkeypatch):
    students = mongomock.MongoClient().db.students
    attempts = mongomock.MongoClient().db.attempts
    careers = mongomock.MongoClient().db.careers
    students.insert_many([
        {"id":"student-a", "token":"token-a", "target_role":"frontend_dev"},
        {"id":"student-b", "token":"token-b", "target_role":"frontend_dev"},
    ])
    careers.insert_one({"id":"frontend_dev", "title":"Frontend Developer", "core_skills":["React", "HTML"], "advanced_skills":[]})
    monkeypatch.setattr(auth, "get_students_collection", lambda: students)
    monkeypatch.setattr(assessment_routes, "get_careers_collection", lambda: careers)
    monkeypatch.setattr(assessment_routes, "get_assessment_attempts_collection", lambda: attempts)

    client = create_app().test_client()
    headers = {"Authorization":"Bearer token-a"}
    response = client.get("/api/assessments/react/questions?level=1", headers=headers)
    assert response.status_code == 200
    assert all("correct" not in q and "answer" not in q for q in response.json["data"])

    questions = response.json["data"]
    keys = QUESTION_BANK["react"]["questions"]
    answers = [{"question_id":q["id"], "selected_option":keys[i][2]} for i,q in enumerate(questions)]
    submitted = client.post("/api/assessments/submit", headers=headers, json={"skill_id":"react", "level":1, "answers":answers})
    assert submitted.status_code == 201
    attempt_id = submitted.json["result"]["attempt_id"]
    assert submitted.json["result"]["score_percentage"] == 100
    assert len(submitted.json["result"]["question_review"]) == 10
    assert submitted.json["result"]["question_review"][0]["is_correct"] is True
    assert client.get("/api/assessments/history", headers=headers).json["data"][0]["attempt_id"] == attempt_id
    assert client.get(f"/api/assessments/results/{attempt_id}", headers={"Authorization":"Bearer token-b"}).status_code == 404
    assert client.get("/api/assessments/react/questions?level=2", headers=headers).status_code == 200
    assert client.get("/api/assessments/react/questions?level=3", headers=headers).status_code == 404
    skill = next(s for s in client.get("/api/assessments/skills", headers=headers).json["data"] if s["id"] == "react")
    assert skill["levels"][0]["passed"] and skill["levels"][1]["unlocked"]
    assert client.post("/api/assessments/submit", headers=headers, json={"skill_id":"react", "level":1, "answers":[]}).status_code == 400
