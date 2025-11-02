import React from 'react';

/**
 * Text Rendering Utilities
 * 
 * Handles line breaks, formatting, and text processing for site content.
 */

/**
 * Converts newlines to <br> tags for proper line break rendering
 */
export function renderTextWithLineBreaks(text: string | undefined | null): React.ReactNode {
  if (!text) return null;
  
  // Split by newlines and create elements with <br> tags
  const lines = text.split('\n');
  
  if (lines.length === 1) {
    return text;
  }
  
  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

/**
 * Smart text processing that handles:
 * - Line breaks (\n)
 * - Multiple consecutive line breaks (converts to paragraph breaks)
 * - Trims excessive whitespace
 */
export function renderSmartText(text: string | undefined | null): React.ReactNode {
  if (!text) return null;
  
  // Normalize line breaks and trim
  const normalized = text
    .replace(/\r\n/g, '\n') // Normalize Windows line breaks
    .replace(/\r/g, '\n')   // Normalize old Mac line breaks
    .trim();
  
  if (!normalized) return null;
  
  // Split by double line breaks to create paragraphs
  const paragraphs = normalized.split(/\n\s*\n/);
  
  if (paragraphs.length === 1) {
    // Single paragraph - just handle line breaks
    return renderTextWithLineBreaks(paragraphs[0]);
  }
  
  // Multiple paragraphs
  return paragraphs.map((paragraph, index) => (
    <React.Fragment key={index}>
      {renderTextWithLineBreaks(paragraph.trim())}
      {index < paragraphs.length - 1 && (
        <>
          <br />
          <br />
        </>
      )}
    </React.Fragment>
  ));
}

/**
 * Utility for counting visible characters (excluding line breaks)
 */
export function getVisibleCharacterCount(text: string): number {
  if (!text) return 0;
  
  // Remove line breaks for character counting
  return text.replace(/\n\r?/g, '').length;
}

/**
 * Utility for preview text (removes line breaks for single-line displays)
 */
export function getPreviewText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  
  // Replace line breaks with spaces for preview
  const singleLine = text.replace(/\n\r?/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (singleLine.length <= maxLength) return singleLine;
  
  // Truncate at word boundary
  const truncated = singleLine.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Validate text for line break limits
 */
export function validateTextLineBreaks(text: string, maxLines: number = 5): {
  isValid: boolean;
  lineCount: number;
  warning?: string;
} {
  if (!text) return { isValid: true, lineCount: 0 };
  
  const lines = text.split('\n');
  const lineCount = lines.length;
  
  if (lineCount <= maxLines) {
    return { isValid: true, lineCount };
  }
  
  return {
    isValid: false,
    lineCount,
    warning: `Too many lines (${lineCount}/${maxLines}). Consider shorter text or multiple sections.`
  };
}

/**
 * Component for rendering text with line breaks
 */
interface TextWithLineBreaksProps {
  children: string | undefined | null;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  smart?: boolean; // Use smart text processing for paragraphs
  [key: `data-${string}`]: any; // Allow data attributes
}

export function TextWithLineBreaks({ 
  children, 
  className, 
  style, 
  as: Component = 'span',
  smart = false,
  ...otherProps
}: TextWithLineBreaksProps) {
  const content = smart ? renderSmartText(children) : renderTextWithLineBreaks(children);
  
  if (!content) return null;
  
  return (
    <Component className={className} style={style} {...otherProps}>
      {content}
    </Component>
  );
}
