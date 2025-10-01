const KEY = 'instantPurchase';

export function setInstantPurchase(data) {
  sessionStorage.setItem(KEY, JSON.stringify({ data }));
}
export function popInstantPurchase() {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    sessionStorage.removeItem(KEY);
    return parsed?.data ?? null;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export function clearInstantPurchase() {
  sessionStorage.removeItem(KEY);
}
