// Safe localStorage wrappers. If localStorage is unavailable or throws
// (private mode, quota), values fall back to an in-memory map so the UI keeps working.

export const USER_KEY = "av_user";
export const SCORES_KEY = "av_scores";

export interface StoredUser {
  name: string;
}

export interface StoredScore {
  game: string;
  score: number;
  name: string;
  at: number;
}

const memory = new Map<string, string>();
const listeners = new Set<() => void>();

export function storageGet(key: string): string | null {
  try {
    const v = window.localStorage.getItem(key);
    if (v !== null) return v;
  } catch {
    // fall through to memory
  }
  return memory.get(key) ?? null;
}

export function storageSet(key: string, value: string): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // memory fallback already set
  }
  listeners.forEach((l) => l());
}

export function storageRemove(key: string): void {
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

// For useSyncExternalStore: notifies on local writes and on writes from other tabs.
export function subscribeStorage(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function parseUser(raw: string | null): StoredUser | null {
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    return u && typeof u.name === "string" ? { name: u.name } : null;
  } catch {
    return null;
  }
}
