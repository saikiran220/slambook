import { format, parseISO, differenceInYears, isValid, parse } from "date-fns";

/**
 * Parse a date string (handles both ISO format and YYYY-MM-DD format)
 */
const parseDate = (dateString: string): Date | null => {
  try {
    // Try ISO format first
    let date = parseISO(dateString);
    if (isValid(date)) {
      return date;
    }
    
    // Try YYYY-MM-DD format (from HTML date input)
    date = parse(dateString, "yyyy-MM-dd", new Date());
    if (isValid(date)) {
      return date;
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string, formatStr: string = "MMMM d, yyyy"): string => {
  try {
    const date = parseDate(dateString);
    if (!date) {
      return dateString;
    }
    return format(date, formatStr);
  } catch {
    return dateString;
  }
};

/**
 * Calculate age from birthday
 */
export const calculateAge = (birthday: string): number | null => {
  try {
    const birthDate = parseDate(birthday);
    if (!birthDate) {
      return null;
    }
    const today = new Date();
    return differenceInYears(today, birthDate);
  } catch {
    return null;
  }
};

/**
 * Format birthday with age
 */
export const formatBirthdayWithAge = (birthday: string): string => {
  const formattedDate = formatDate(birthday);
  const age = calculateAge(birthday);
  if (age !== null) {
    return `${formattedDate} (${age} years old)`;
  }
  return formattedDate;
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = parseDate(dateString);
    if (!date) {
      return dateString;
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch {
    return dateString;
  }
};

