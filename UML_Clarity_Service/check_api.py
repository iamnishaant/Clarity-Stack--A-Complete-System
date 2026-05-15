import requests, json

url = 'http://127.0.0.1:8000/api/document/3_SRS_Grp6_SREERAM%20R/use-cases'
print(f"Fetching from {url}...")
try:
    r = requests.get(url, timeout=120) # LLM might take 10-20 seconds
    r.raise_for_status()
    data = r.json()
    print("\nACTORS:", data.get('actors', []))
    print("\nUSE CASES:")
    for uc in data.get('use_cases', []):
        print(f"  [{uc.get('id')}] {uc.get('actor','?'):20s} -> {uc.get('label','?')}")
    print("\nRELATIONSHIPS:")
    for rel in data.get('relationships', []):
        print(f"  {rel.get('source')} --(<<{rel.get('type')}>>)--> {rel.get('target')}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(e.response.text)
