import { date, esc, money, timeLeft } from './format.js';

const pot = (competition) => money(competition.potUsd);
const feeLabel = (competition) => Number(competition.entryFeeUsd) > 0 ? money(competition.entryFeeUsd) : 'Free entry';
const bountyHref = (slug) => `#/bounty/${encodeURIComponent(slug ?? '')}`;

export function shell(content) {
  return `<header class="site-header"><a class="wordmark" href="#/" aria-label="PrizeBoard home"><span class="mark">P</span><span>PrizeBoard</span></a><nav aria-label="Main navigation"><a href="#/">Open board</a><a href="#/leaderboard">Leaderboard</a></nav><a class="header-cta" href="https://make.fun" target="_blank" rel="noreferrer">Built on make.fun <span>↗</span></a></header><main>${content}</main><footer><span>PrizeBoard <span class="dot">·</span> a clearer view of what’s up for grabs</span><a href="https://make.fun" target="_blank" rel="noreferrer">Powered by make.fun ↗</a></footer>`;
}

export function board(competitions) {
  const cards = competitions.map((b, i) => `
    <a class="competition-card" href="${bountyHref(b.slug)}" style="--card-index:${i}">
      <div class="card-top"><span class="category">${esc(b.category || 'Open bounty')}</span><span class="card-arrow" aria-hidden="true">↗</span></div>
      <div class="card-prize-label">Prize pool</div><div class="card-prize">${pot(b)}</div>
      <h2>${esc(b.title)}</h2>
      <p class="card-description">${esc(b.description || 'A new opportunity for builders.')}</p>
      <div class="card-meta"><span><b>${esc(timeLeft(b.deadline))}</b><small>Deadline</small></span><span><b>${Number(b.submissionCount ?? 0).toLocaleString()}</b><small>Entries</small></span><span><b>${esc(feeLabel(b))}</b><small>Entry fee</small></span></div>
    </a>`).join('');
  return `<section class="board-hero"><div><p class="eyebrow"><span class="live-dot"></span> THE OPEN BOARD <span class="eyebrow-rule"></span> ${competitions.length} OPPORTUNITIES</p><h1>Good work<br>gets <em>rewarded.</em></h1><p class="hero-copy">A live view of the open competitions on make.fun. Find your next challenge, see what’s at stake, and make something worth sharing.</p><div class="hero-foot"><span>Curated by the community. Funded by the future.</span><span class="hero-index">01 / OPEN CALLS</span></div></div><div class="hero-aside"><span class="aside-spark">✳</span><p>Ideas are everywhere.<br><strong>Make yours count.</strong></p><span class="aside-caption">BROWSE THE LATEST CALLS <span>↓</span></span></div></section>
    <section class="board-section"><div class="section-heading"><div><p class="eyebrow">THE LINEUP</p><h2>Open for entries <span class="count-pill">${competitions.length}</span></h2></div><div class="board-controls"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Search competitions" aria-label="Search by title"></label><label class="sort-wrap"><span>Sort</span><select id="sort"><option value="pot">Biggest pot</option><option value="deadline">Deadline soon</option></select></label></div></div><div id="competition-grid" class="competition-grid">${cards || '<div class="empty-state"><span>✳</span><h3>No open competitions right now</h3><p>Check back soon for the next opportunity.</p></div>'}</div><p class="results-note" id="results-note">Showing ${competitions.length} open ${competitions.length === 1 ? 'competition' : 'competitions'}</p></section>`;
}

function rewardLines(rewards) {
  if (!Array.isArray(rewards) || !rewards.length) return '<p class="muted">Rewards breakdown has not been published.</p>';
  return `<ol class="reward-list">${rewards.map((reward, index) => {
    if (typeof reward !== 'object' || reward === null) return `<li><span class="reward-place">${String(index + 1).padStart(2, '0')}</span><span>${esc(reward)}</span></li>`;
    const place = reward.place ?? reward.rank ?? reward.position ?? index + 1;
    const label = reward.label ?? reward.title ?? reward.name ?? `${place}${place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th'} place`;
    const value = reward.amountUsd ?? reward.prizeUsd ?? reward.amount ?? reward.value;
    return `<li><span class="reward-place">${esc(place)}</span><span>${esc(label)}</span><strong>${value == null ? '' : money(value)}</strong></li>`;
  }).join('')}</ol>`;
}

export function bounty(b) {
  const rules = b.rules ?? b.requirements ?? b.requirementsSummary ?? b.rulesSummary;
  const ruleText = Array.isArray(rules) ? rules.map((rule) => `<li>${esc(typeof rule === 'object' ? rule.text ?? rule.description ?? JSON.stringify(rule) : rule)}</li>`).join('') : (rules ? `<li>${esc(rules)}</li>` : '<li>Review the competition brief and make.fun listing for participation requirements.</li>');
  return `<section class="detail-hero"><div class="detail-breadcrumb"><a href="#/">← All competitions</a><span>/</span><span>${esc(b.category || 'Competition')}</span></div><div class="detail-layout"><div class="detail-title"><p class="eyebrow"><span class="live-dot"></span> OPEN COMPETITION</p><h1>${esc(b.title)}</h1><p class="detail-intro">${esc(b.description || 'Competition details are available on make.fun.')}</p><a class="primary-link" href="https://make.fun/bounty/${encodeURIComponent(b.slug)}" target="_blank" rel="noreferrer">View competition on make.fun <span>↗</span></a></div><aside class="prize-panel"><span class="panel-label">TOTAL PRIZE POOL</span><strong>${pot(b)}</strong><span class="panel-divider"></span><div class="panel-facts"><span>ENTRY FEE</span><b>${esc(feeLabel(b))}</b><span>ENTRIES</span><b>${Number(b.submissionCount ?? 0).toLocaleString()}</b><span>TIME LEFT</span><b>${esc(timeLeft(b.deadline))}</b></div></aside></div></section>
    <section class="detail-content"><div class="detail-main"><div class="content-block"><p class="eyebrow">THE BRIEF</p><h2>What you’re building</h2><div class="prose">${esc(b.description || 'No additional description has been provided.').replace(/\n/g, '<br>')}</div></div><div class="content-block"><p class="eyebrow">PARTICIPATION</p><h2>Rules & requirements</h2><ul class="requirements">${ruleText}</ul></div></div><aside class="detail-side"><div class="content-block reward-block"><p class="eyebrow">THE PAYOUT</p><h2>Rewards breakdown</h2>${rewardLines(b.rewards)}</div><div class="deadline-card"><span class="deadline-icon">◷</span><span class="eyebrow">SUBMISSIONS CLOSE</span><strong>${esc(date(b.deadline))}</strong><span class="remaining">${esc(timeLeft(b.deadline))}</span></div><a class="text-link" href="#/leaderboard?competition=${encodeURIComponent(b.slug)}">See the leaderboard <span>→</span></a></aside></section>`;
}

export function leaderboard(data, competitions, selectedSlug) {
  const columns = Array.isArray(data.columns) ? data.columns : [];
  const rows = data.rows ?? data.entries ?? data.leaderboard ?? data.items ?? [];
  const defaultMetrics = ['score', 'win_rate', 'winRate'];
  const metricKeys = columns.map((c) => typeof c === 'string' ? c : c.key ?? c.id ?? c.name).filter(Boolean);
  const metrics = [...new Set([...metricKeys, ...defaultMetrics])].filter((key) => !['rank', 'entrant', 'agent', 'handle', 'title', 'entry_title'].includes(key.toLowerCase())).slice(0, 2);
  const labels = new Map(columns.map((c) => typeof c === 'object' ? [c.key ?? c.id ?? c.name, c.label ?? c.title ?? c.name ?? c.key] : [c, c]));
  const selected = competitions.find((item) => item.slug === selectedSlug);
  const options = competitions.map((item) => `<option value="${esc(item.slug)}" ${item.slug === selectedSlug ? 'selected' : ''}>${esc(item.title)}</option>`).join('');
  const tableRows = rows.map((row, index) => {
    const handle = row.entrant ?? row.agent ?? row.handle ?? '';
    const handleValue = typeof handle === 'object' ? handle.handle ?? handle.name ?? '' : handle;
    const title = row.entryTitle ?? row.entry_title ?? row.title ?? row.solution?.title ?? 'Untitled entry';
    const cells = metrics.map((key) => `<td>${formatMetric(row[key], key)}</td>`).join('');
    return `<tr><td class="rank-cell">${esc(row.rank ?? index + 1)}</td><td><a class="entrant-link" href="#/profile/${encodeURIComponent(handleValue)}">${esc(handleValue || 'Anonymous builder')} <span>↗</span></a></td><td>${esc(title)}</td>${cells}</tr>`;
  }).join('');
  return `<section class="leaderboard-hero"><div><p class="eyebrow">COMMUNITY STANDINGS</p><h1>Good work<br><em>rises up.</em></h1><p>See how builders are placing across the open calls.</p></div><div class="leaderboard-ornament">✳<small>THE BOARD<br>OF RECORD</small></div></section><section class="leaderboard-section"><div class="section-heading"><div><p class="eyebrow">LIVE RANKINGS</p><h2>${esc(selected?.title ?? 'Choose a competition')}</h2></div><label class="sort-wrap competition-picker"><span>Competition</span><select id="competition-picker">${options || '<option value="">No open competitions</option>'}</select></label></div>${data.phase ? `<p class="phase-note">${esc(data.phase)} phase</p>` : ''}<div class="table-wrap"><table><thead><tr><th>RANK</th><th>BUILDER</th><th>ENTRY</th>${metrics.map((m) => `<th>${esc(labels.get(m) ?? m.replace(/[_-]/g, ' '))}</th>`).join('')}</tr></thead><tbody>${tableRows || `<tr><td class="table-empty" colspan="${3 + metrics.length}">No leaderboard entries yet.</td></tr>`}</tbody></table></div><p class="results-note">Rankings update with competition activity.</p></section>`;
}

export function profile(data) {
  const record = data.record ?? {};
  const stats = [['Entered', record.competitions_entered], ['Placed', record.competitions_placed], ['Won', record.competitions_won], ['Podiums', record.podium_finishes], ['Best placement', record.best_placement == null ? '—' : `#${record.best_placement}`], ['Prize USD', money(record.prize_usd)]];
  const solutions = (data.solutions ?? []).map((solution) => `<a class="solution-row" href="${bountyHref(solution.competition?.slug)}"><span><small>${esc(solution.competition?.title ?? 'Competition')}</small><strong>${esc(solution.title)}</strong></span><span class="solution-arrow">↗</span></a>`).join('');
  const handle = data.handle ?? '';
  const name = data.display_name || handle || 'Builder';
  return `<section class="profile-hero"><p class="detail-breadcrumb"><a href="#/">← Open board</a><span>/</span><span>Builder profile</span></p><div class="profile-heading"><div class="avatar">${esc(name.trim().slice(0, 1).toUpperCase() || 'B')}</div><div><p class="eyebrow">BUILDER PROFILE</p><h1>${esc(name)}</h1><p class="handle">@${esc(handle)}</p></div></div>${data.bio ? `<p class="profile-bio">${esc(data.bio)}</p>` : ''}${data.wallet?.address ? `<div class="wallet-line"><span>WALLET</span><code>${esc(data.wallet.address)}</code></div>` : ''}</section><section class="profile-record"><p class="eyebrow">COMPETITION RECORD</p><div class="stats-grid">${stats.map(([label, value]) => `<div class="stat-box"><strong>${esc(value ?? '—')}</strong><span>${esc(label)}</span></div>`).join('')}</div></section><section class="solutions-section"><div class="section-heading"><div><p class="eyebrow">BUILDER’S WORK</p><h2>Solutions <span class="count-pill">${(data.solutions ?? []).length}</span></h2></div></div><div class="solutions-list">${solutions || '<p class="muted">No public solutions yet.</p>'}</div></section>`;
}

function formatMetric(value, key) {
  if (value == null || value === '') return '—';
  if (/win.?rate/i.test(key)) return `${value}%`;
  if (typeof value === 'number') return Number.isInteger(value) ? value.toLocaleString('en-US') : value.toFixed(2);
  return esc(value);
}

export function errorView(error, retryLabel = 'Try again') {
  return `<section class="error-state"><span>!</span><p class="eyebrow">COULD NOT LOAD LIVE DATA</p><h1>Something interrupted the board.</h1><p>${esc(error?.message || 'The make.fun API did not respond. Check your connection and try again.')}</p><button id="retry-button">${esc(retryLabel)} <span>↻</span></button><small>PrizeBoard reads competition data directly from the public make.fun API.</small></section>`;
}

export function loadingView() {
  return '<section class="loading-state"><span class="loading-mark">✳</span><p>Reading the live board…</p></section>';
}
