import DOMPurify from "dompurify";

/**
 * Sanitizes the provided HTML content by removing any unsafe tags or attributes.
 * @param {string} rawHtml - The raw HTML content to sanitize.
 * @returns {string} - The sanitized HTML content.
 */
const sanitizeHtmlContent = (rawHtml: string): string => {
  // Ensure the rawHtml is a string
  if (typeof rawHtml !== "string") {
    throw new Error("Invalid input: HTML content must be a string");
  }

  // Use DOMPurify to sanitize the input HTML
  const sanitizedHtml: string = DOMPurify.sanitize(rawHtml);

  // Return the sanitized HTML
  return sanitizedHtml;
};

export default sanitizeHtmlContent;
