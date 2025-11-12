//
//
// Simple client-side auth helpers using localStorage.
// Gating UX only; no backend involved.
//
const AUTH_KEY = 'rps:auth:v1';
const PROFILE_KEY = 'rps:user:v1';

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
  /** Clears the local auth flag and profile. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(PROFILE_KEY);
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

// PUBLIC_INTERFACE
export function saveUserProfile(profile) {
  /**
   * Saves user profile metadata to localStorage.
   * PUBLIC_INTERFACE
   * profile: { name: string, anime: string, animeImageUrl?: string }
   * animeImageUrl is optional and used for displaying the selected anime image in the UI.
   */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const safe = {
      name: String(profile?.name || '').slice(0, 100),
      anime: String(profile?.anime || '').slice(0, 100),
      animeImageUrl: String(profile?.animeImageUrl || '').slice(0, 500),
    };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function getUserProfile() {
  /**
   * Retrieves saved user profile, or null if unavailable/invalid.
   * PUBLIC_INTERFACE
   * Returns: { name: string, anime: string, animeImageUrl?: string } | null
   */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const name = typeof parsed?.name === 'string' ? parsed.name : '';
    const anime = typeof parsed?.anime === 'string' ? parsed.anime : '';
    const animeImageUrl = typeof parsed?.animeImageUrl === 'string' ? parsed.animeImageUrl : '';
    if (!name && !anime) return null;
    return { name, anime, animeImageUrl };
  } catch {
    return null;
  }
}
