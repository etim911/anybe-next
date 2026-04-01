/**
 * Normalize a phone number to E.164 format.
 * Examples:
 *   "2134567890" → "+12134567890"
 *   "+12134567890" → "+12134567890"
 *   "12134567890" → "+12134567890"
 *   "+1-US2134567890" → "+12134567890" (handle the old dropdown bug)
 */
export function normalizePhone(phone: string): string {
  // Strip everything except digits and leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If already starts with +, return as-is (already E.164)
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If 10 digits, assume US/CA and prepend +1
  if (cleaned.length === 10) {
    return '+1' + cleaned;
  }
  
  // If 11 digits starting with 1, prepend +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return '+' + cleaned;
  }
  
  // Default: prepend + and hope for the best
  return '+' + cleaned;
}