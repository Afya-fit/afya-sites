/**
 * SectionBox - Section Variable Wrapper Component
 * 
 * The foundation of the One-Path Styling Framework. This component:
 * 1. Accepts only CSS custom properties (--sb-*) via the vars prop
 * 2. Applies those variables to a section element with proper data attributes
 * 3. Provides the highest priority layer in the CSS variable cascade
 * 
 * CRITICAL RULES:
 * - Only CSS custom properties (keys starting with "--sb-") are allowed in vars
 * - No inline property styles (fontSize, color, margin, etc.) are permitted
 * - All sections must wrap their content with this component
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React, { CSSProperties, ReactNode } from 'react';

export interface SectionBoxProps {
  /** Unique identifier for the section instance */
  id: string;
  
  /** Section type identifier for debugging and styling hooks */
  type: string;

  /** Optional human-friendly slug for the HTML id attribute */
  slug?: string;
  
  /** CSS custom properties to apply to this section (highest priority in cascade) */
  vars?: Record<string, string | number>;
  
  /** Content to render inside the section */
  children: ReactNode;
  
  /** Additional CSS classes to apply to the section element */
  className?: string;
  
  /** ARIA label for accessibility */
  'aria-label'?: string;
  
  /** Whether this section is currently selected in the builder */
  'data-selected'?: boolean;
  
  /** Any other data attributes for section configuration */
  [key: `data-${string}`]: any;
}

/**
 * SectionBox Component
 * 
 * Provides the section-level CSS variable layer (highest priority in the cascade).
 * Only accepts CSS custom properties starting with "--sb-" to maintain framework discipline.
 */
export function SectionBox({
  id,
  type,
  slug,
  vars,
  children,
  className,
  'aria-label': ariaLabel,
  'data-selected': dataSelected,
  ...otherProps
}: SectionBoxProps) {
  // Build the style object with only CSS custom properties
  const style: CSSProperties = {};
  
  if (vars) {
    for (const [key, value] of Object.entries(vars)) {
      // Enforce framework discipline: only CSS custom properties allowed
      if (key.startsWith('--sb-')) {
        (style as any)[key] = String(value);
      } else {
        // Warn about violations but don't break the component
        console.warn(
          `[SB] Invalid style property "${key}" in SectionBox. ` +
          `Only CSS custom properties (--sb-*) are allowed. ` +
          `Use mapSectionVars to convert props to variables.`
        );
      }
    }
  }
  
  // Build data attributes for debugging and styling hooks
  const dataAttributes = {
    'data-sb-section': type,
    'data-sb-id': id,
    ...(dataSelected !== undefined && { 'data-selected': dataSelected }),
    ...otherProps, // Include any other data-* attributes
  };
  
  const htmlId = slug && /^[a-z0-9\-]+$/.test(slug) ? slug : `section-${id}`;
  return (
    <section
      id={htmlId}
      {...dataAttributes}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

/**
 * Type guard to validate that a variables object only contains CSS custom properties
 * Useful for TypeScript strict mode and development warnings
 */
export function validateSectionVars(vars: Record<string, any>): vars is Record<string, string | number> {
  for (const key of Object.keys(vars)) {
    if (!key.startsWith('--sb-')) {
      console.error(
        `[SB] Invalid CSS variable "${key}". ` +
        `All section variables must start with "--sb-". ` +
        `Check your mapSectionVars implementation.`
      );
      return false;
    }
  }
  return true;
}

/**
 * Development helper to log section variables for debugging
 * Only runs in development mode to avoid production console spam
 */
export function debugSectionVars(sectionType: string, vars: Record<string, any>): void {
  if (process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true') {
    console.group(`🎨 [SB] Section variables for ${sectionType}`);
    
    if (!vars || Object.keys(vars).length === 0) {
      console.log('No section variables applied (using theme/token defaults)');
    } else {
      Object.entries(vars).forEach(([key, value]) => {
        const isValid = key.startsWith('--sb-');
        console.log(
          `${isValid ? '✅' : '❌'} ${key}: ${value}`,
          ...(isValid ? [] : ['← Invalid: must start with --sb-'])
        );
      });
    }
    
    console.groupEnd();
  }
}

/**
 * Hook for accessing section variables in components
 * Provides a consistent way to read computed CSS variable values
 */
export function useSectionVars(elementRef: React.RefObject<HTMLElement>) {
  const [vars, setVars] = React.useState<Record<string, string>>({});
  
  React.useEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    const computedStyle = getComputedStyle(element);
    const sectionVars: Record<string, string> = {};
    
    // Extract all CSS custom properties starting with --sb-
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      if (property.startsWith('--sb-')) {
        sectionVars[property] = computedStyle.getPropertyValue(property).trim();
      }
    }
    
    setVars(sectionVars);
  }, [elementRef]);
  
  return vars;
}

export default SectionBox;
