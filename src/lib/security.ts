import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Used for content coming from external APIs like KOPIS.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  
  // Clean up common KOPIS noise before sanitizing
  const cleaned = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>?/gm, "");
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p", "div", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "style"],
  });
}

/**
 * Strips all HTML tags and returns plain text.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}
