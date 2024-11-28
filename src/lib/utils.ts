import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatterOptions {
  makeFirstLetterUppercase?: boolean;
  allowNonConsecutiveSpaces?: boolean;
  allowNumbers?: boolean;
  makeLettersAfterSpaceCapital?: boolean;
  allowUppercaseInBetween?: boolean;
  allowSpecialCharacters?: boolean;
}

export function formatName(
  input: string,
  options: FormatterOptions = {}
): string {
  const {
    makeFirstLetterUppercase = true,
    allowNonConsecutiveSpaces = false,
    allowNumbers = false,
    makeLettersAfterSpaceCapital = true,
    allowUppercaseInBetween = false,
    allowSpecialCharacters = false,
  } = options;

  // Remove consecutive spaces and keep only allowed characters
  let formatted = input.replace(/\s+/g, " ");

  if (!allowNumbers) {
    formatted = formatted.replace(/\d/g, "");
  }

  if (allowNonConsecutiveSpaces) {
    const length = formatted.length;
    if (formatted[length - 1] === " " && formatted[length - 2] === " ") {
      formatted = formatted.slice(0, length - 1);
    }
    if (formatted[0] === " ") {
      formatted = formatted.slice(1);
    }
  } else {
    formatted = formatted.replace(" ", "");
  }

  // Keep only allowed characters
  if (allowSpecialCharacters) {
    // This regex allows letters, numbers, spaces, and common special characters
    formatted = formatted.replace(
      /[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g,
      ""
    );
  } else {
    formatted = formatted.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  // Convert to lowercase
  if (!allowUppercaseInBetween) formatted = formatted.toLowerCase();

  // Capitalize first letter if option is true
  if (makeFirstLetterUppercase && formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Capitalize letters after spaces if option is true
  if (makeLettersAfterSpaceCapital) {
    formatted = formatted.replace(/\s+[a-z]/g, (match) => match.toUpperCase());
  }

  return formatted;
}

/**
 * Formats a given date into a specified format.
 * @param date - The date to format (string, Date, or undefined/null).
 * @param format - The desired format for the date (default: "MMMM Do, YYYY").
 * @returns A formatted date string or "Invalid Date" if the input is not a valid date.
 */
export const formatDate = (
  date: string | Date | undefined | null,
  format = "MMMM Do, YYYY"
): string => {
  if (!date) return "No Date Available"; // Fallback for null/undefined dates
  const formattedDate = moment(date).format(format);
  return formattedDate === "Invalid date" ? "Invalid Date" : formattedDate;
};

/**
 * Returns a human-readable "time ago" string for a given date.
 * @param date - The date to format (string, Date, or undefined/null).
 * @returns A string indicating how long ago the date occurred or "No Date Available" if the input is invalid.
 */
export const formatTimeAgo = (
  date: string | Date | undefined | null
): string => {
  if (!date) return "No Date Available"; // Handle null/undefined
  const timeAgo = moment(date).fromNow();
  return timeAgo === "Invalid date" ? "Invalid Date" : timeAgo;
};


export  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count.toString();
  };
