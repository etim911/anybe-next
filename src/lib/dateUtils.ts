import { format, isToday, isTomorrow, isPast, differenceInDays, parseISO, isValid } from 'date-fns';

export function parseDateSafe(dateInput: string | Date): Date | null {
  if (!dateInput) return null;
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
  return isValid(date) ? date : null;
}

export function formatEventDate(dateInput: string | Date): string {
  const date = parseDateSafe(dateInput);
  if (!date) return 'Date TBA';
  
  // Example: "Friday, April 15th"
  return format(date, "EEEE, MMMM do");
}

export function formatEventRelative(dateInput: string | Date): string | null {
  const date = parseDateSafe(dateInput);
  if (!date) return null;
  
  if (isPast(date) && !isToday(date)) {
    return 'Concluded';
  }
  
  if (isToday(date)) {
    return 'Starts Tonight';
  }
  
  if (isTomorrow(date)) {
    return 'Opening Tomorrow';
  }
  
  const days = differenceInDays(date, new Date());
  if (days > 1) {
    return `Opening in ${days} Days`;
  }
  
  return null;
}
