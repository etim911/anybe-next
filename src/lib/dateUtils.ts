import { format, isToday, isTomorrow, isPast, differenceInDays, parseISO, isValid } from 'date-fns';

export function parseDateSafe(dateInput: string | Date | null | undefined): Date | null {
  if (!dateInput) return null;
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    return isValid(date) ? date : null;
  } catch (e) {
    return null;
  }
}

export function formatEventDate(dateInput: string | Date | null | undefined): string {
  const date = parseDateSafe(dateInput);
  if (!date) return 'Date TBA';
  
  // Example: "Friday, April 15th"
  try {
    return format(date, "EEEE, MMMM do");
  } catch (e) {
    return 'Date TBA';
  }
}

export function formatEventRelative(dateInput: string | Date | null | undefined): string | null {
  const date = parseDateSafe(dateInput);
  if (!date) return null;
  
  try {
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
  } catch (e) {
    return null;
  }
  
  return null;
}
