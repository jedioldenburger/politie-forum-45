/**
 * Date Utility Functions
 *
 * Helper functions for converting timestamps to ISO8601 format
 * for proper SEO metadata and structured data.
 */

/**
 * Convert milliseconds epoch, date string, or Date object to ISO8601 string
 *
 * @param input - Timestamp (ms), date string, or Date object
 * @returns ISO8601 formatted string (e.g., "2025-10-08T12:53:48.000Z")
 *
 * @example
 * toISO(1759928028776) // "2025-10-08T12:53:48.776Z"
 * toISO("2025-10-08") // "2025-10-08T00:00:00.000Z"
 * toISO(new Date()) // Current time in ISO8601
 */
export function toISO(input: number | string | Date | null | undefined): string {
  if (!input) return new Date().toISOString();

  const d = typeof input === "number" || typeof input === "string"
    ? new Date(Number(input))
    : input;

  // Fallback if input is not parseable
  if (isNaN(d.getTime())) return new Date().toISOString();

  return d.toISOString();
}

/**
 * Convert to ISO8601 with Dutch timezone (+01:00 CET or +02:00 CEST)
 *
 * Google News/Discover prefers local timezone over UTC for better regional relevance
 *
 * @param input - Timestamp (ms), date string, or Date object
 * @returns ISO8601 formatted string with Dutch timezone offset
 *
 * @example
 * toLocalISO(1729840428000) // "2024-10-25T10:53:48+02:00" (CEST)
 * toLocalISO(1704067200000) // "2024-01-01T00:00:00+01:00" (CET)
 */
export function toLocalISO(input: number | string | Date | null | undefined): string {
  if (!input) return toLocalISODate(new Date());

  const d = typeof input === "number" || typeof input === "string"
    ? new Date(Number(input))
    : input;

  if (isNaN(d.getTime())) return toLocalISODate(new Date());

  return toLocalISODate(d);
}

/**
 * Helper: Format Date to ISO8601 with Dutch timezone offset
 */
function toLocalISODate(date: Date): string {
  // Get timezone offset in minutes (CET = -60, CEST = -120)
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutes = String(absOffset % 60).padStart(2, '0');

  // Format: YYYY-MM-DDTHH:mm:ss+01:00
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${hours}:${minutes}`;
}

/**
 * Format date for display in Dutch locale
 *
 * @param input - Timestamp (ms), date string, or Date object
 * @returns Formatted date string (e.g., "8 oktober 2025")
 */
export function formatDateNL(input: number | string | Date): string {
  const d = typeof input === "number" || typeof input === "string"
    ? new Date(Number(input))
    : input;

  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
