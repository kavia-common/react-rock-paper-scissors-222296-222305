//
// Simple client-side auth helpers using localStorage.
// Gating UX only; no backend involved.
//

const AUTH_KEY = 'rps:auth:v1';

// PUBLIC_INTERFACE
export function isAuthenticated() {
  /** Returns true if the local auth flag is set. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const val = window.localStorage.getItem(AUTH_KEY);
    return val === '1' || val === 'true';
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function login() {
  /** Sets the local auth flag. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(AUTH_KEY, '1');
    // Notify other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: AUTH_KEY, newValue: '1' }));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears the local auth flag. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(AUTH_KEY);
    // Notify other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: AUTH_KEY, newValue: null }));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function subscribeAuth(cb) {
  /**
   * Subscribes to auth changes across tabs via storage events.
   * Returns an unsubscribe function.
   */
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => {
    if (e.key === AUTH_KEY) {
      cb(isAuthenticated());
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
