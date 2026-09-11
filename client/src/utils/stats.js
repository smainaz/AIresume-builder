// Lightweight per-user usage stats, stored in localStorage alongside the
// app's existing localStorage-based auth. No backend/database involved —
// mirrors how `users` and `user` are already stored in App.js.

const statsKey = (email) => `stats_${email}`;

export function getStats(email) {
  if (!email) return { logins: 0, cvsCreated: 0, lastLogin: null };
  const raw = localStorage.getItem(statsKey(email));
  return raw ? JSON.parse(raw) : { logins: 0, cvsCreated: 0, lastLogin: null };
}

function saveStats(email, stats) {
  localStorage.setItem(statsKey(email), JSON.stringify(stats));
  return stats;
}

export function recordLogin(email) {
  if (!email) return getStats(email);
  const stats = getStats(email);
  stats.logins += 1;
  stats.lastLogin = new Date().toISOString();
  return saveStats(email, stats);
}

export function incrementCvCount(email) {
  if (!email) return getStats(email);
  const stats = getStats(email);
  stats.cvsCreated += 1;
  return saveStats(email, stats);
}
