"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  SCORES_KEY,
  USER_KEY,
  parseUser,
  storageGet,
  storageRemove,
  storageSet,
  subscribeStorage,
  type StoredScore,
  type StoredUser,
} from "@/lib/storage";

interface AuthContextValue {
  user: StoredUser | null;
  login: (name: string) => void;
  logout: () => void;
  saveScore: (entry: { game: string; score: number; name: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const getSnapshot = () => storageGet(USER_KEY);
// Server and first client render see no user, so hydration always matches.
const getServerSnapshot = () => null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribeStorage, getSnapshot, getServerSnapshot);
  const user = useMemo(() => parseUser(raw), [raw]);

  const login = useCallback((name: string) => {
    // TODO(backend): replace with a real authentication call (REST or Supabase).
    const clean = name.trim().toUpperCase().slice(0, 10);
    storageSet(USER_KEY, JSON.stringify({ name: clean }));
  }, []);

  const logout = useCallback(() => {
    storageRemove(USER_KEY);
  }, []);

  const saveScore = useCallback(
    (entry: { game: string; score: number; name: string }) => {
      // TODO(backend): send the score to the leaderboard API instead of localStorage.
      let all: StoredScore[] = [];
      try {
        const parsed = JSON.parse(storageGet(SCORES_KEY) || "[]");
        if (Array.isArray(parsed)) all = parsed;
      } catch {
        // start from an empty list
      }
      all.push({ ...entry, at: Date.now() });
      storageSet(SCORES_KEY, JSON.stringify(all));
    },
    [],
  );

  const value = useMemo(
    () => ({ user, login, logout, saveScore }),
    [user, login, logout, saveScore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
