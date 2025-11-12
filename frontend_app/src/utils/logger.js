//
// Minimal logging utility for React apps with environment-controlled verbosity.
//
// PUBLIC_INTERFACE
export function createLogger(namespace = 'app') {
  /**
   * Creates a logger with methods debug, info, error that respect REACT_APP_LOG_LEVEL.
   * Levels: silent < error < info < debug
   * In production, setting REACT_APP_LOG_LEVEL=silent will fully suppress logs.
   * In development, default to 'debug' for richer diagnostics.
   */
  const rawLevel = process.env.REACT_APP_LOG_LEVEL;
  // Normalize level and choose defaults per environment
  const isProd = process.env.NODE_ENV === 'production' || process.env.REACT_APP_NODE_ENV === 'production';
  const level = normalizeLevel(rawLevel ?? (isProd ? 'error' : 'debug'));

  const levelRank = {
    silent: 0,
    error: 1,
    info: 2,
    debug: 3,
  };

  const current = levelRank[level] ?? levelRank.error;

  const mk = (method, minLevel) => {
    const minRank = levelRank[minLevel] ?? levelRank.error;
    if (current < minRank) {
      // No-op
      return () => {};
    }
    // Map to appropriate console method with namespace prefix
    const c = method === 'error' ? console.error : method === 'info' ? console.info : console.debug;
    // Guard console existence (JS test/SSR safety)
    if (typeof c !== 'function') {
      return () => {};
    }
    return (...args) => {
      try {
        c(`[${namespace}]`, ...args);
      } catch {
        // never let logging crash the app
      }
    };
  };

  return {
    level,
    // PUBLIC_INTERFACE
    debug: mk('debug', 'debug'),
    // PUBLIC_INTERFACE
    info: mk('info', 'info'),
    // PUBLIC_INTERFACE
    error: mk('error', 'error'),
  };
}

function normalizeLevel(value) {
  const v = String(value || '').toLowerCase().trim();
  if (v === 'silent' || v === 'off' || v === 'none') return 'silent';
  if (v === 'error' || v === 'err') return 'error';
  if (v === 'info' || v === 'log') return 'info';
  if (v === 'debug' || v === 'trace' || v === 'verbose') return 'debug';
  // default
  return 'error';
}
