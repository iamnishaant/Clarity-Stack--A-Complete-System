import sqlite3

conn = sqlite3.connect("claritystack.db")
cur = conn.cursor()

# List all tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cur.fetchall()
print("Tables:", tables)

# Try to list projects
for table_name in [t[0] for t in tables]:
    if "project" in table_name.lower():
        print(f"\n--- {table_name} ---")
        cur.execute(f"SELECT * FROM {table_name} LIMIT 10")
        rows = cur.fetchall()
        # Get column names
        col_names = [description[0] for description in cur.description]
        print("Columns:", col_names)
        print(f"Rows ({len(rows)}):")
        for r in rows:
            print(r)

conn.close()
