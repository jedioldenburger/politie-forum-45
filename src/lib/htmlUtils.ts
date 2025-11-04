// src/lib/htmlUtils.ts

/**
 * Basic HTML sanitizer to fix common issues from AI-generated content.
 * Handles nested <p> tags and converts markdown headers to HTML.
 *
 * @param html The raw HTML string (may contain markdown syntax).
 * @returns A sanitized HTML string.
 */
export function sanitizeHtml(html: string): string {
  if (!html) {
    return '';
  }

  let sanitizedHtml = html;

  // Convert markdown headers to HTML (must be done before other processing)
  // ### Header 3 -> <h3>Header 3</h3>
  sanitizedHtml = sanitizedHtml.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  // ## Header 2 -> <h2>Header 2</h2>
  sanitizedHtml = sanitizedHtml.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  // # Header 1 -> <h1>Header 1</h1> (rare in body content)
  sanitizedHtml = sanitizedHtml.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Convert markdown bold/italic to HTML
  // **bold** -> <strong>bold</strong>
  sanitizedHtml = sanitizedHtml.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // *italic* -> <em>italic</em> (single asterisks)
  sanitizedHtml = sanitizedHtml.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Remove literal <p> tags if they appear as text (e.g., "<p>**Text**</p>" in summary)
  // This handles cases where AI outputs "<p>" as literal text instead of HTML
  sanitizedHtml = sanitizedHtml.replace(/^<p>\s*/gm, '');
  sanitizedHtml = sanitizedHtml.replace(/\s*<\/p>$/gm, '');

  // Replace <p><p>...</p></p> with <p>...</p>
  sanitizedHtml = sanitizedHtml.replace(/<p>\s*<p>(.*?)<\/p>\s*<\/p>/g, '<p>$1</p>');

  // Remove <TITLE> tags that sometimes slip through from AI
  sanitizedHtml = sanitizedHtml.replace(/<\/?TITLE>/gi, '');

  return sanitizedHtml;
}
