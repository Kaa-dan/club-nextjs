import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function camelCaseToNormalCase(text: string) {
  if (!text) return "";
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function normalToCamelcase(str: string) {
  //'My name' to 'myName'
  if (!str) return "";
  return str
    .replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function (b) {
      return b.toLowerCase();
    });
}

export function getFormattedDateAndTime(_date: string | Date): {
  formattedDate: string;
  formattedTime: string;
  dateAndTime: string;
} {
  const date = new Date(_date);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return {
    formattedDate,
    formattedTime,
    dateAndTime: `${formattedDate} - ${formattedTime}`,
  };
}

interface FormatterOptions {
  makeFirstLetterUppercase?: boolean;
  allowNonConsecutiveSpaces?: boolean;
  allowNumbers?: boolean;
  makeLettersAfterSpaceCapital?: boolean;
  allowUppercaseInBetween?: boolean;
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

  // Keep only alphabets and allowed characters
  formatted = formatted.replace(/[^a-zA-Z0-9\s]/g, "");

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

// export function isValidEmail(email: string): boolean {
//   // This regex pattern follows RFC 5322 standards
//   const emailRegex =
//     /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
//   return emailRegex.test(email);
// }

export function isValidEmail(email: string): boolean {
  // This regex enforces:
  // 1. Standard characters for local part
  // 2. @ symbol
  // 3. Domain with at least two parts
  // 4. Top-level domain must be at least 2 characters
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters and check if the result is exactly 10 digits
  const numericValue = phone.replace(/\D/g, "");
  return numericValue.length === 10;
}
