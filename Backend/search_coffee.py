import sqlite3

conn = sqlite3.connect("claritystack.db")
cur = conn.cursor()

# Search for projects with 'coffee' in the name
cur.execute("SELECT id, name, owner, visibility FROM projects WHERE name LIKE ?", ('%coffee%',))
rows = cur.fetchall()

if rows:
    print(f"Found {len(rows)} project(s) matching 'coffee':")
    for r in rows:
        print(r)
else:
    print("No project found matching 'coffee'.")

# Also list all projects just in case
print("\nAll projects in DB:")
cur.execute("SELECT id, name, owner, visibility FROM projects")
for r in cur.fetchall():
    print(r)

conn.close()
