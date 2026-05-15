import sqlite3, uuid
from datetime import datetime

conn = sqlite3.connect("claritystack.db")

now = datetime.utcnow().isoformat()
projects = [
    (str(uuid.uuid4()), "AI Research Hub", "Collaborative AI research platform", "Publish 3 papers", "Academic use only", "alice@example.com", "public", now, now),
    (str(uuid.uuid4()), "Open Source Dashboard", "Real-time analytics for open source repos", "1k users in 6 months", "No budget constraints", "bob@example.com", "public", now, now),
    (str(uuid.uuid4()), "Climate Data Tracker", "Track global climate metrics", "Cover 100 countries", "Data must be open", "carol@example.com", "public", now, now),
]

conn.executemany(
    "INSERT INTO projects (id, name, purpose, success_criteria, constraints, owner, visibility, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
    projects
)
conn.commit()
print(f"Seeded {len(projects)} demo public projects from other users.")
conn.close()
