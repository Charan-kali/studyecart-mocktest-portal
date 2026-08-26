// Thin wrapper around localStorage so persistence logic lives in one place.
// Falls back gracefully if localStorage is unavailable.

const NS = "praxis";

function key(k) {
  return `${NS}:${k}`;
}

export function loadJSON(k, fallback) {
  try {
    const raw = window.localStorage.getItem(key(k));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(k, value) {
  try {
    window.localStorage.setItem(key(k), JSON.stringify(value));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function removeJSON(k) {
  try {
    window.localStorage.removeItem(key(k));
  } catch {
    // ignore
  }
}
