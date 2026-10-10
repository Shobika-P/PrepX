"""
Unit tests for Authentication & Persistent Student Profile Memory Endpoints.
"""

import os
import sys
import uuid
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_auth_register_and_login(client):
    rand_id = uuid.uuid4().hex[:6].upper()
    test_email = f"test.{rand_id.lower()}@campus.edu"
    test_roll = f"99TST{rand_id}"

    # Register new student
    register_payload = {
        "name": "Test Auth Student",
        "email": test_email,
        "roll_number": test_roll,
        "password": "secretpassword123",
        "department": "Computer Science",
        "semester": 5,
        "target_role": "full_stack_dev",
        "technical_skills": ["HTML", "CSS", "Python"]
    }

    res = client.post("/api/auth/register", json=register_payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["status"] == "success"
    assert "token" in data
    assert data["user"]["email"] == test_email

    token = data["token"]

    # Test /api/auth/me with token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.get_json()
    assert me_data["user"]["name"] == "Test Auth Student"

    # Test login with email
    login_res = client.post("/api/auth/login", json={
        "identifier": test_email,
        "password": "secretpassword123"
    })
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    assert login_data["user"]["roll_number"] == test_roll

    # Test profile update
    update_res = client.put("/api/auth/profile", headers={"Authorization": f"Bearer {token}"}, json={
        "id": me_data["user"]["id"],
        "technical_skills": ["HTML", "CSS", "Python", "React", "Node.js"],
        "attendance_percentage": 91.5
    })
    assert update_res.status_code == 200
    updated_data = update_res.get_json()
    assert "React" in updated_data["user"]["technical_skills"]
    assert updated_data["user"]["attendance_percentage"] == 91.5
