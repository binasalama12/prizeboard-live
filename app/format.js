export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 });
}

export function date(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Date unavailable' : `${parsed.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' })} UTC`;
}

export function timeLeft(value) {
  const ms = new Date(value).getTime() - Date.now();
  if (!Number.isFinite(ms)) return 'Deadline unavailable';
  if (ms <= 0) return 'Ended';
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (days) return `${days}d ${hours}h left`;
  if (hours) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function slugTitle(slug) {
  return String(slug ?? '').split('-').filter(Boolean).map((word) => word[0]?.toUpperCase() + word.slice(1)).join(' ');
}
