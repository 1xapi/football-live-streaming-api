# Football Live Streaming API

[![RapidAPI](https://img.shields.io/badge/RapidAPI-Subscribe-blue?style=for-the-badge&logo=rapidapi)](https://rapidapi.com/1xapi-rapid-team/api/football-live-streaming-api)
[![Status](https://img.shields.io/badge/Status-Online-brightgreen?style=for-the-badge)]()
[![Uptime](https://img.shields.io/badge/Uptime-99.9%25-brightgreen?style=for-the-badge)]()

Real-time football match data with **2-13 streaming sources per match** across **50+ leagues worldwide**. High-performance API with sub-50ms response times globally.

---

## Features

- **Real-time scores** - Live match data updated every minute
- **Multiple streams per match** - 2 to 13 streaming servers for every match
- **50+ leagues** - Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, and more
- **3 stream types** - Direct (HLS/FLV), DRM-protected (MPEG-DASH), and referer-based
- **Smart filtering** - By date, status (live/upcoming), stream type, and league
- **Pagination** - 20 matches per page with full pagination metadata
- **High performance** - ~50ms average response time, 99.9% uptime

---

## Quick Start

### 1. Subscribe on RapidAPI

Get your API key at: **[rapidapi.com/1xapi-rapid-team/api/football-live-streaming-api](https://rapidapi.com/1xapi-rapid-team/api/football-live-streaming-api)**

### 2. Make your first request

**cURL:**
```bash
curl "https://football-live-streaming-api.p.rapidapi.com/matches?status=live&page=1" \
  -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
  -H "X-RapidAPI-Host: football-live-streaming-api.p.rapidapi.com"
```

**Python:**
```python
import requests

response = requests.get(
    "https://football-live-streaming-api.p.rapidapi.com/matches",
    headers={
        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
        "X-RapidAPI-Host": "football-live-streaming-api.p.rapidapi.com"
    },
    params={"status": "live", "page": 1}
)

data = response.json()
for match in data["matches"]:
    servers = match.get("servers", [])
    print(f"{match['home_team_name']} vs {match['away_team_name']} - {len(servers)} streams")
```

**JavaScript (Node.js 18+):**
```javascript
const response = await fetch(
  "https://football-live-streaming-api.p.rapidapi.com/matches?status=live&page=1",
  {
    headers: {
      "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
      "X-RapidAPI-Host": "football-live-streaming-api.p.rapidapi.com",
    },
  }
);

const data = await response.json();
console.log(`${data.pagination.total} live matches found`);
```

---

## API Reference

### `GET /matches`

Returns paginated football matches with streaming links.

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `page`    | number | Page number (default: 1, 20 matches per page)    |
| `status`  | string | Filter: `live` or `vs` (upcoming)                |
| `date`    | string | Filter by date in `DDMMYYYY` format              |
| `type`    | string | Filter by stream type: `direct`, `drm`, `referer`|
| `league`  | string | Filter by league name (partial match)            |

### `GET /leagues`

Returns all available leagues with match counts.

| Parameter | Type   | Description                                    |
|-----------|--------|------------------------------------------------|
| `page`    | number | Page number (default: 1, 20 leagues per page)  |

---

## Sample Response

```json
{
  "matches": [
    {
      "match_time": "1758385800",
      "match_status": "live",
      "home_team_name": "Manchester United",
      "home_team_logo": "https://cdn.1xapi.com/images/teams/manchester-united.png",
      "homeTeamScore": "2",
      "away_team_name": "Chelsea",
      "away_team_logo": "https://cdn.1xapi.com/images/teams/chelsea.png",
      "awayTeamScore": "1",
      "league_name": "Premier League",
      "league_logo": "https://cdn.1xapi.com/images/leagues/premier-league.png",
      "servers": [
        {
          "name": "Server 1",
          "url": "https://stream1.example.com/live/match.m3u8",
          "header": {
            "user-agent": "Mozilla/5.0 ..."
          },
          "type": "direct"
        },
        {
          "name": "Server 2",
          "url": "https://stream2.example.com/live/match.mpd|drmScheme=clearkey&drmLicense=...",
          "header": {
            "user-agent": "Mozilla/5.0 ..."
          },
          "type": "drm"
        },
        {
          "name": "Server 3",
          "url": "https://stream3.example.com/live/match.m3u8",
          "header": {
            "user-agent": "Mozilla/5.0 ...",
            "referer": "https://sportsportal.example.com/"
          },
          "type": "referer"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 147,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

> Full sample with multiple matches: [`examples/sample-response.json`](examples/sample-response.json)

---

## Stream Types

| Type       | Format         | Description                                                                 |
|------------|----------------|-----------------------------------------------------------------------------|
| `direct`   | HLS (.m3u8) / FLV (.flv) | Play directly in any video player (VLC, FFmpeg, ExoPlayer, AVPlayer) |
| `drm`      | MPEG-DASH (.mpd)         | Clearkey DRM - license info included after `\|` in URL. Use Shaka Player or ExoPlayer |
| `referer`  | HLS (.m3u8)              | Requires `referer` header from the `header.referer` field              |

### Playing a direct stream
```python
# The URL can be used directly with any HLS-compatible player
stream_url = match["servers"][0]["url"]
user_agent = match["servers"][0]["header"]["user-agent"]
# Pass both to your video player
```

### Playing a DRM stream
```javascript
// URL format: https://...stream.mpd|drmScheme=clearkey&drmLicense=https://...
const [manifestUrl, drmParams] = server.url.split("|");
// Configure Shaka Player or ExoPlayer with manifestUrl + DRM params
```

### Playing a referer stream
```python
# Set the referer header when requesting the stream
headers = {
    "User-Agent": server["header"]["user-agent"],
    "Referer": server["header"]["referer"]
}
```

### Important: Referer & DRM streams in web browsers

Some stream URLs (`referer` and `drm` types) **cannot be played directly in a web-based video player** due to browser CORS and referer restrictions. Browsers do not allow setting custom `Referer` headers on media requests from JavaScript.

**To play these streams on the web, you need a proxy setup:**

1. **Server-side proxy** - Route the stream through your own backend that adds the required `Referer` / DRM headers before forwarding to the client.
2. **Native apps** - Mobile (ExoPlayer, AVPlayer) and desktop players (VLC, FFmpeg) can set custom headers freely and play all stream types without restrictions.

`direct` type streams work in web players without any proxy.

---

## Interactive Demo

Open [`demo-app/index.html`](demo-app/index.html) in your browser - no build tools needed. Enter your RapidAPI key and browse live matches with a visual interface.

Features:
- Filter by All / Live / Upcoming
- Match cards with team logos, scores, league info
- Server count and stream type badges per match
- Pagination controls
- Dark theme, mobile-responsive

---

## More Examples

| Language   | File                                                       |
|------------|------------------------------------------------------------|
| Python     | [`examples/python/example.py`](examples/python/example.py) |
| JavaScript | [`examples/javascript/example.js`](examples/javascript/example.js) |
| cURL       | [`examples/curl/examples.sh`](examples/curl/examples.sh)   |

---

## Use Cases

- **Mobile streaming apps** (iOS / Android) - stream football matches with multiple fallback servers
- **Web platforms** - embed live streams in your website
- **Smart TV apps** - build apps for Fire TV, Roku, Android TV
- **Sports analytics** - track live scores and match data
- **Betting platforms** - real-time match status for live betting
- **Fantasy sports** - live updates for fantasy football apps

---

## Response Codes

| Code | Description                     |
|------|---------------------------------|
| 200  | Success                         |
| 401  | Missing or invalid API key      |
| 403  | Invalid RapidAPI credentials    |
| 404  | Endpoint not found              |
| 429  | Rate limit exceeded             |
| 500  | Server error                    |

---

## Subscribe

**[Get your API key on RapidAPI](https://rapidapi.com/football-live-streaming-api)** and start building today.
