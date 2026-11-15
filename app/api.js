const API = 'https://make.fun/api';

async function get(path) {
  const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

export async function getCompetitions() {
  const all = [];
  let cursor = '';
  const seen = new Set();
  do {
    const query = new URLSearchParams({ status: 'open' });
    if (cursor) query.set('cursor', cursor);
    const page = await get(`/competitions?${query}`);
    const entries = Array.isArray(page) ? page : (page.items ?? page.competitions ?? page.data ?? []);
    all.push(...entries);
    const next = page.next_cursor ?? page.nextCursor ?? null;
    if (!next || seen.has(next)) break;
    seen.add(next);
    cursor = next;
  } while (true);
  return all;
}

export const getCompetition = (slug) => get(`/competitions/${encodeURIComponent(slug)}`);
export const getLeaderboard = (slug) => get(`/competitions/${encodeURIComponent(slug)}/leaderboard`);
export const getProfile = (handle) => get(`/profiles/${encodeURIComponent(handle)}`);
