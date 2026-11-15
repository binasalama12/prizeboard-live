import { getCompetition, getCompetitions, getLeaderboard, getProfile } from './api.js';
import { board, bounty, errorView, leaderboard, loadingView, profile, shell } from './views.js';
import { money } from './format.js';

const app = document.getElementById('app');
let competitions = [];
let boardLoaded = false;
let renderToken = 0;

function route() {
  const hash = location.hash || '#/';
  const [path, query = ''] = hash.slice(1).split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { page: parts[0] ?? '', value: parts[1] ?? '', params: new URLSearchParams(query) };
}

function fail(error, rerender) {
  app.innerHTML = shell(errorView(error));
  document.getElementById('retry-button')?.addEventListener('click', rerender);
  window.__shotReady = true;
}

function bindBoard() {
  const grid = document.getElementById('competition-grid');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  if (!grid || !search || !sort) return;
  let order = 'pot';
  const refresh = () => {
    const term = search.value.trim().toLocaleLowerCase();
    const visible = competitions.filter((item) => item.title?.toLocaleLowerCase().includes(term));
    visible.sort((a, b) => order === 'deadline'
      ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      : Number(b.potUsd || 0) - Number(a.potUsd || 0));
    const active = document.activeElement;
    grid.innerHTML = visible.map((item, i) => cardHTML(item, i)).join('') || '<div class="empty-state"><span>⌕</span><h3>No matching competitions</h3><p>Try another title or clear your search.</p></div>';
    const note = document.getElementById('results-note');
    note.textContent = `Showing ${visible.length} of ${competitions.length} open ${competitions.length === 1 ? 'competition' : 'competitions'}`;
    if (active === search) search.focus({ preventScroll: true });
  };
  search.addEventListener('input', refresh);
  sort.addEventListener('change', () => { order = sort.value; refresh(); });
}

function cardHTML(b, i) {
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const moneyText = money(b.potUsd);
  const ms = new Date(b.deadline).getTime() - Date.now();
  const left = !Number.isFinite(ms) ? 'Deadline unavailable' : ms <= 0 ? 'Ended' : ms >= 86400000 ? `${Math.floor(ms / 86400000)}d ${Math.floor(ms % 86400000 / 3600000)}h left` : ms >= 3600000 ? `${Math.floor(ms / 3600000)}h ${Math.floor(ms % 3600000 / 60000)}m left` : `${Math.floor(ms / 60000)}m left`;
  const fee = Number(b.entryFeeUsd) > 0 ? money(b.entryFeeUsd) : 'Free entry';
  return `<a class="competition-card" href="#/bounty/${encodeURIComponent(b.slug)}" style="--card-index:${i}"><div class="card-top"><span class="category">${esc(b.category || 'Open bounty')}</span><span class="card-arrow">↗</span></div><div class="card-prize-label">Prize pool</div><div class="card-prize">${moneyText}</div><h2>${esc(b.title)}</h2><p class="card-description">${esc(b.description || 'A new opportunity for builders.')}</p><div class="card-meta"><span><b>${esc(left)}</b><small>Deadline</small></span><span><b>${Number(b.submissionCount ?? 0).toLocaleString()}</b><small>Entries</small></span><span><b>${esc(fee)}</b><small>Entry fee</small></span></div></a>`;
}

async function render() {
  const token = ++renderToken;
  const current = route();
  window.__shotReady = false;
  app.innerHTML = shell(loadingView());
  const stillCurrent = () => token === renderToken;
  try {
    let content;
    if (!current.page) {
      if (!boardLoaded) {
        competitions = await getCompetitions();
        boardLoaded = true;
      }
      const sorted = [...competitions].sort((a, b) => Number(b.potUsd || 0) - Number(a.potUsd || 0));
      content = board(sorted);
      document.title = 'PrizeBoard — open make.fun competitions';
    } else if (current.page === 'bounty' && current.value) {
      const item = await getCompetition(current.value);
      content = bounty(item.competition ?? item);
      document.title = `${(item.competition ?? item).title} — PrizeBoard`;
    } else if (current.page === 'leaderboard') {
      if (!boardLoaded) {
        competitions = await getCompetitions();
        boardLoaded = true;
      }
      const preferred = current.params.get('competition');
      const selected = competitions.find((item) => item.slug === preferred) ?? [...competitions].sort((a, b) => Number(b.potUsd || 0) - Number(a.potUsd || 0))[0];
      if (!selected) throw new Error('No open competitions are available for a leaderboard.');
      const data = await getLeaderboard(selected.slug);
      content = leaderboard(data, competitions, selected.slug);
      document.title = `Leaderboard — ${selected.title} — PrizeBoard`;
    } else if (current.page === 'profile' && current.value) {
      const data = await getProfile(current.value);
      content = profile(data.profile ?? data);
      document.title = `${(data.profile ?? data).display_name || current.value} — PrizeBoard`;
    } else {
      throw new Error('That PrizeBoard page could not be found.');
    }
    if (!stillCurrent()) return;
    app.innerHTML = shell(content);
    if (!current.page) bindBoard();
    if (current.page === 'leaderboard') document.getElementById('competition-picker')?.addEventListener('change', (event) => {
      location.hash = `#/leaderboard?competition=${encodeURIComponent(event.target.value)}`;
    });
    window.scrollTo(0, 0);
    window.__shotReady = true;
  } catch (error) {
    if (!stillCurrent()) return;
    document.title = 'PrizeBoard — live data unavailable';
    fail(error, render);
  }
}

window.addEventListener('hashchange', render);
render();
