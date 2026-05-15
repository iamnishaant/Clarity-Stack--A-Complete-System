import sqlite3

conn = sqlite3.connect("claritystack.db")
conn.execute("UPDATE projects SET visibility='public' WHERE visibility='private'")
conn.commit()
print(f"Updated {conn.total_changes} project(s) to public.")

# Verify
cur = conn.cursor()
cur.execute("SELECT id, name, owner, visibility FROM projects")
for r in cur.fetchall():
    print(r)
conn.close()
