"use client";

import { sanitizeHtml } from "@/lib/security";
import { cn } from "@/lib/utils";

interface SanitizedContentProps {
  content: string;
  className?: string;
}

/**
 * A component that safely renders HTML content coming from the KOPIS API.
 * It uses DOMPurify to prevent XSS attacks.
 */
export function SanitizedContent({ content, className }: SanitizedContentProps) {
  if (!content) return null;

  return (
    <div
      className={cn("prose prose-slate dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  );
}
