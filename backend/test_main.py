"""
FitTrack Backend Test Suite
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to FitTrack API" in data["message"]


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "FitTrack" in data["app"]
    assert data["database"] == "connected"


def test_auth_verify_dev_mode():
    headers = {"Authorization": "Bearer dev_athlete_user_456"}
    response = client.get("/auth/verify", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["email"] == "local.athlete@fittrack.local"


def test_activity_sync():
    headers = {"Authorization": "Bearer dev_athlete_user_456"}
    payload = {
        "date": "2026-10-07",
        "steps": 8500,
        "step_goal": 10000,
        "distance": 6200.5,
        "calories": 420.0,
        "active_minutes": 55,
    }
    response = client.post("/activity/sync", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["steps"] == 8500
    assert data["calories"] == 420.0


def test_workout_crud():
    headers = {"Authorization": "Bearer dev_athlete_user_456"}
    workout_payload = {
        "type": "running",
        "start_time": "2026-10-07T06:30:00Z",
        "end_time": "2026-10-07T07:05:00Z",
        "duration_seconds": 2100,
        "distance": 5000.0,
        "calories": 340,
    }
    create_resp = client.post("/workouts", json=workout_payload, headers=headers)
    assert create_resp.status_code == 201
    workout_id = create_resp.json()["id"]

    list_resp = client.get("/workouts", headers=headers)
    assert list_resp.status_code == 200
    workouts = list_resp.json()
    assert any(w["id"] == workout_id for w in workouts)


def test_goals():
    headers = {"Authorization": "Bearer dev_athlete_user_456"}
    goal_payload = {
        "daily_steps": 12000,
        "daily_calories": 600,
        "active_minutes": 60,
    }
    resp = client.put("/goals", json=goal_payload, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["daily_steps"] == 12000
