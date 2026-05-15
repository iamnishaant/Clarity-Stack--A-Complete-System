import httpx
import json
import os

url = "https://integrate.api.nvidia.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}
payload = {
    "model": "meta/llama-3.1-70b-instruct",
    "messages": [{"role": "user", "content": "hello"}]
}

resp = httpx.post(url, headers=headers, json=payload)
print(f"Status Code: {resp.status_code}")
print(f"Response: {resp.text}")
