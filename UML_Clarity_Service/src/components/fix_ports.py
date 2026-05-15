import re
import os

file_path = r"f:\AMRITA ALL SEMESTER\projects\Clarity-Stack-clarity_stack_v1\UML_Clarity_Service\src\components\Dashboard.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace 8000 with 8006
content = content.replace("127.0.0.1:8000", "127.0.0.1:8006")
content = content.replace("localhost:8000", "localhost:8006")
content = content.replace("port 8000", "port 8006")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replaced 8000 with 8006 successfully.")
