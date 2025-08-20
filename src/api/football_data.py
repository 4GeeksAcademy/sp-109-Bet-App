import os
import requests

BASE_URL = "https://api.football-data.org/v4"
API_KEY = os.getenv("FOOTBALL_DATA_API_KEY")

def fd_get_match(match_id: int):
    headers = {"X-Auth-Token": API_KEY} if API_KEY else {}
    url = f"{BASE_URL}/matches/{match_id}"
    r = requests.get(url, headers=headers, timeout=8)
    r.raise_for_status()
    return r.json().get("match", {})