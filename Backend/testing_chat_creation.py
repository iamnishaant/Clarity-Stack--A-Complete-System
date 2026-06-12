import requests

BASE_URL = "http://127.0.0.1:8000"

# Register/Login
try:
    requests.post(f"{BASE_URL}/api/auth/register", json={"email": "test@test.com", "password": "password"})
except:
    pass

res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "test@test.com", "password": "password"})
token = res.json().get("access_token")
print("Token:", token)

# Create Project
headers = {"Authorization": f"Bearer {token}"}
res = requests.post(f"{BASE_URL}/projects", json={
    "name": "Test Project",
    "purpose": "Testing creating a project",
    "success_criteria": "Testing creating a project",
    "constraints": "Testing creating a project",
    "visibility": "private"
}, headers=headers)
project = res.json()
print("Project:", project)
project_id = project.get("id")

# Create Chat
res = requests.post(f"{BASE_URL}/projects/{project_id}/chats", json={
    "title": "Test Chat",
    "source_type": "user",
    "purpose": "Test",
    "phase": "Test",
    "description": "Test",
    "owner": "test@test.com"
}, headers=headers)

print("Create Chat Response:", res.status_code, res.text)
