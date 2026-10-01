from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login():
    response = client.post("/login", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert "token" in response.json()