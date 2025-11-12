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

/**
 * PUBLIC_INTERFACE
 */
export function saveUserProfile(profile) {
  /**
   * Saves user profile metadata to localStorage.
   * PUBLIC_INTERFACE
   * Accepts legacy and new fields. Normalized shape saved:
   * - name: string
   * - id: string (avatar id)    [new]
   * - imageUrl: string          [new]
   * - anime: string             [legacy mirror of id]
   * - animeImageUrl: string     [legacy mirror of imageUrl]
   */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const id = String(profile?.id || profile?.anime || '').slice(0, 100);
    const imageUrl = String(profile?.imageUrl || profile?.animeImageUrl || '').slice(0, 500);
    const safe = {
      name: String(profile?.name || '').slice(0, 100),
      id,
      imageUrl,
      // keep legacy keys for compatibility with any older UI references
      anime: id,
      animeImageUrl: imageUrl,
    };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 */
export function getUserProfile() {
  /**
   * Retrieves saved user profile, or null if unavailable/invalid.
   * PUBLIC_INTERFACE
   * Returns normalized: { name: string, id: string, imageUrl: string, anime: string, animeImageUrl: string } | null
   * - id/imageUrl are preferred new fields
   * - anime/animeImageUrl are kept for backward compatibility
   */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const name = typeof parsed?.name === 'string' ? parsed.name : '';
    const id = typeof parsed?.id === 'string' ? parsed.id : (typeof parsed?.anime === 'string' ? parsed.anime : '');
    const imageUrl =
      typeof parsed?.imageUrl === 'string'
        ? parsed.imageUrl
        : (typeof parsed?.animeImageUrl === 'string' ? parsed.animeImageUrl : '');
    const anime = typeof parsed?.anime === 'string' ? parsed.anime : id;
    const animeImageUrl =
      typeof parsed?.animeImageUrl === 'string' ? parsed.animeImageUrl : imageUrl;

    if (!name && !id && !anime) return null;
    return { name, id, imageUrl, anime, animeImageUrl };
  } catch {
    return null;
  }
}
