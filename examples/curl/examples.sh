#!/bin/bash
# Football Live Streaming API - cURL Examples
# https://rapidapi.com/football-live-streaming-api
#
# Replace YOUR_RAPIDAPI_KEY with your actual RapidAPI key.

API_KEY="YOUR_RAPIDAPI_KEY"
HOST="football-live-streaming-api.p.rapidapi.com"
BASE="https://${HOST}"

# ──────────────────────────────────────────────
# 1. Get all matches (page 1, 20 per page)
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 2. Get live matches only
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?status=live&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 3. Get upcoming matches
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?status=vs&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 4. Get matches by date (format: DDMMYYYY)
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?date=15022026&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 5. Get only direct streams (no DRM)
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?type=direct&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 6. Get only DRM-protected streams
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?type=drm&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 7. Get referer-based streams
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?type=referer&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 8. Get all leagues with match counts
# ──────────────────────────────────────────────
curl -s "${BASE}/leagues?page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 9. Combine filters: live + direct streams
# ──────────────────────────────────────────────
curl -s "${BASE}/matches?status=live&type=direct&page=1" \
  -H "X-RapidAPI-Key: ${API_KEY}" \
  -H "X-RapidAPI-Host: ${HOST}" | python3 -m json.tool

# ──────────────────────────────────────────────
# 10. API health check (no key required)
# ──────────────────────────────────────────────
curl -s "${BASE}/"
