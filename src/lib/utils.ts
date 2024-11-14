import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    formatted = formatted.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g, "");
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
