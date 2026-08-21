import { useSyncExternalStore } from "react";

const STORAGE_KEY = "incar_admin_username";

/**
 * There's no /whoami endpoint — the session cookie is what actually gates
 * access, this is display-only. sessionStorage can throw (private-mode
 * quota, storage disabled), so failures here just mean the sidebar falls
 * back to a generic label rather than breaking login/logout.
 */
export function setStoredAdminUsername(username: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, username);
  } catch {
    // Ignore — the footer falls back to a generic label.
  }
}

export function getStoredAdminUsername(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearStoredAdminUsername(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

function subscribeToNothing() {
  // sessionStorage never changes from outside this tab during a session —
  // no "storage" event listener needed, this component tree is the only
  // writer. useSyncExternalStore still requires a subscribe function.
  return () => {};
}

function getServerSnapshot(): string | null {
  return null;
}

/** Reads the username set by admin-session-storage.ts without a hydration
 * mismatch or a setState-in-effect — sessionStorage is an external store,
 * so useSyncExternalStore is the correct primitive, not useState+useEffect. */
export function useStoredAdminUsername(): string | null {
  return useSyncExternalStore(subscribeToNothing, getStoredAdminUsername, getServerSnapshot);
}
