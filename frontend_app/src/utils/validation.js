//
// Simple client-side validation helpers for auth forms
//

// PUBLIC_INTERFACE
export function isValidEmail(email) {
  /** Returns true if email appears valid via basic pattern check. */
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Basic RFC5322-inspired, but intentionally permissive for client-side
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(trimmed);
}

// PUBLIC_INTERFACE
export function isValidPassword(pwd) {
  /** Returns true if password meets a minimal length and non-space constraint. */
  if (!pwd || typeof pwd !== 'string') return false;
  const minLen = 6;
  return pwd.trim().length >= minLen;
}
