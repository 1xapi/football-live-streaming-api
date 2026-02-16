/**
 * Football Live Streaming API - JavaScript (Node.js) Examples
 * https://rapidapi.com/football-live-streaming-api
 *
 * Get live football matches with streaming links from 50+ leagues.
 * Requires Node.js 18+ (built-in fetch).
 */

const API_URL = "https://football-live-streaming-api.p.rapidapi.com";
const HEADERS = {
  "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
  "X-RapidAPI-Host": "football-live-streaming-api.p.rapidapi.com",
};

async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${API_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// --- Example 1: Get live matches ---
async function getLiveMatches(page = 1) {
  const data = await fetchAPI("/matches", { status: "live", page });

  console.log("=".repeat(60));
  console.log("LIVE MATCHES");
  console.log("=".repeat(60));

  for (const match of data.matches) {
    const score = `${match.homeTeamScore} - ${match.awayTeamScore}`;
    const servers = match.servers || [];
    console.log(
      `  ${match.home_team_name} ${score} ${match.away_team_name}`
    );
    console.log(
      `  League: ${match.league_name} | Streams: ${servers.length}`
    );
    console.log();
  }

  const p = data.pagination;
  console.log(`Page ${p.page} of ${p.totalPages} (${p.total} total matches)\n`);
  return data;
}

// --- Example 2: Get today's matches ---
async function getTodaysMatches() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const dateStr = `${dd}${mm}${yyyy}`;

  const data = await fetchAPI("/matches", { date: dateStr, page: 1 });

  console.log("=".repeat(60));
  console.log("TODAY'S MATCHES");
  console.log("=".repeat(60));

  for (const match of data.matches.slice(0, 5)) {
    const status = match.match_status.toUpperCase();
    console.log(
      `  [${status}] ${match.home_team_name} vs ${match.away_team_name}`
    );
    console.log(`  League: ${match.league_name}`);
    console.log();
  }

  return data;
}

// --- Example 3: Get all leagues ---
async function getLeagues() {
  const data = await fetchAPI("/leagues", { page: 1 });

  console.log("=".repeat(60));
  console.log("AVAILABLE LEAGUES");
  console.log("=".repeat(60));

  for (const league of data.leagues) {
    console.log(
      `  ${league.name}: ${league.matches} matches (${league.live} live, ${league.upcoming} upcoming)`
    );
  }

  console.log(`\nTotal: ${data.pagination.total} leagues`);
  return data;
}

// --- Example 4: Paginate through all matches ---
async function getAllMatches() {
  let allMatches = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await fetchAPI("/matches", { page });
    allMatches = [...allMatches, ...data.matches];
    hasMore = data.pagination.hasNext;
    page++;
  }

  console.log(`\nFetched ${allMatches.length} total matches across ${page - 1} pages`);
  return allMatches;
}

// Run all examples
async function main() {
  try {
    await getLiveMatches();
    await getTodaysMatches();
    await getLeagues();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
