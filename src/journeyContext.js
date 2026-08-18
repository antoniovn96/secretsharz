const STORAGE_KEY = 'secretsharz_journey_context';

export function saveJourneyContext(context = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...context,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (_) {
    // Session storage is optional; navigation must continue if unavailable.
  }
}

export function readJourneyContext() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function clearJourneyContext() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}
