// Admin utilities — mirrors the app's existing localStorage-based data
// model (no backend/database involved), matching users/stats/templates
// patterns already used in App.js, Login.js, Signup.js, and stats.js.

import { getStats } from './stats';

// The one email allowed to have admin access. Change this to your own
// email — it's the only account that will ever get the admin role.
export const ADMIN_EMAIL = 'sandramaina078@gmail.com';

export function isAdminEmail(email) {
  return Boolean(email) && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

const USERS_KEY = 'users';
const DISABLED_TEMPLATES_KEY = 'admin_disabled_templates';
const ANNOUNCEMENT_KEY = 'admin_announcement';

function readUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ---------------------------------------------------------------------------
// User management
// ---------------------------------------------------------------------------

export function getAllUsersWithStats() {
  return readUsers().map(u => ({
    ...u,
    role: roleForEmail(u.email),
    stats: getStats(u.email),
  }));
}

export function deleteUser(email) {
  const users = readUsers().filter(u => u.email !== email);
  writeUsers(users);
  localStorage.removeItem(`stats_${email}`);
  return true;
}

// Role is always derived from the email, never from what's stored — so
// even if localStorage is edited by hand, only ADMIN_EMAIL ever gets in.
export function roleForEmail(email) {
  return isAdminEmail(email) ? 'admin' : 'user';
}

// ---------------------------------------------------------------------------
// Template visibility
// ---------------------------------------------------------------------------

export function getDisabledTemplates() {
  return JSON.parse(localStorage.getItem(DISABLED_TEMPLATES_KEY) || '[]');
}

export function setTemplateEnabled(key, enabled) {
  const disabled = new Set(getDisabledTemplates());
  if (enabled) disabled.delete(key); else disabled.add(key);
  localStorage.setItem(DISABLED_TEMPLATES_KEY, JSON.stringify([...disabled]));
}

// ---------------------------------------------------------------------------
// Site announcement banner
// ---------------------------------------------------------------------------

export function getAnnouncement() {
  return localStorage.getItem(ANNOUNCEMENT_KEY) || '';
}

export function setAnnouncement(text) {
  if (text && text.trim()) {
    localStorage.setItem(ANNOUNCEMENT_KEY, text.trim());
  } else {
    localStorage.removeItem(ANNOUNCEMENT_KEY);
  }
}
