export interface Guest {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at?: string;
}

const GUEST_KEY = 'anybe_guest';

export function getStoredGuest(): Guest | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(GUEST_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setStoredGuest(guest: Guest): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
}

export function clearStoredGuest(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_KEY);
}
