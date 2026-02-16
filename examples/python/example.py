"""
Football Live Streaming API - Python Examples
https://rapidapi.com/football-live-streaming-api

Get live football matches with streaming links from 50+ leagues.
"""

import requests
import json
from datetime import datetime

API_URL = "https://football-live-streaming-api.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "football-live-streaming-api.p.rapidapi.com"
}


def get_live_matches(page=1):
    """Fetch currently live matches."""
    response = requests.get(
        f"{API_URL}/matches",
        headers=HEADERS,
        params={"status": "live", "page": page}
    )
    response.raise_for_status()
    return response.json()


def get_matches_by_date(date_str, page=1):
    """
    Fetch matches for a specific date.
    date_str format: DDMMYYYY (e.g., '15022026')
    """
    response = requests.get(
        f"{API_URL}/matches",
        headers=HEADERS,
        params={"date": date_str, "page": page}
    )
    response.raise_for_status()
    return response.json()


def get_upcoming_matches(page=1):
    """Fetch upcoming (not yet started) matches."""
    response = requests.get(
        f"{API_URL}/matches",
        headers=HEADERS,
        params={"status": "vs", "page": page}
    )
    response.raise_for_status()
    return response.json()


def get_leagues(page=1):
    """Fetch all available leagues with match counts."""
    response = requests.get(
        f"{API_URL}/leagues",
        headers=HEADERS,
        params={"page": page}
    )
    response.raise_for_status()
    return response.json()


def get_direct_streams(page=1):
    """Fetch matches filtered to only include direct (non-DRM) streams."""
    response = requests.get(
        f"{API_URL}/matches",
        headers=HEADERS,
        params={"type": "direct", "page": page}
    )
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    # --- Example 1: Get live matches ---
    print("=" * 60)
    print("LIVE MATCHES")
    print("=" * 60)

    data = get_live_matches()
    matches = data["matches"]
    pagination = data["pagination"]

    for match in matches:
        score = f"{match['homeTeamScore']} - {match['awayTeamScore']}"
        servers = match.get("servers", [])
        print(f"  {match['home_team_name']} {score} {match['away_team_name']}")
        print(f"  League: {match['league_name']} | Streams: {len(servers)}")
        print()

    print(f"Page {pagination['page']} of {pagination['totalPages']} "
          f"({pagination['total']} total matches)")
    print()

    # --- Example 2: Get today's matches ---
    print("=" * 60)
    print("TODAY'S MATCHES")
    print("=" * 60)

    today = datetime.now().strftime("%d%m%Y")
    data = get_matches_by_date(today)

    for match in data["matches"][:5]:  # Show first 5
        status = match["match_status"].upper()
        print(f"  [{status}] {match['home_team_name']} vs {match['away_team_name']}")
        print(f"  League: {match['league_name']}")
        print()
    print()

    # --- Example 3: Get leagues ---
    print("=" * 60)
    print("AVAILABLE LEAGUES")
    print("=" * 60)

    data = get_leagues()
    for league in data["leagues"]:
        print(f"  {league['name']}: {league['matches']} matches "
              f"({league['live']} live, {league['upcoming']} upcoming)")

    print(f"\nTotal: {data['pagination']['total']} leagues")
