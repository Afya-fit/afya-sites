/**
 * SectionBox Component Tests - Foundation Layer
 * 
 * Tests the SectionBox wrapper component that enforces
 * the CSS variable naming discipline and provides the
 * section layer of the variable cascade.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SectionBox, validateSectionVars, debugSectionVars } from '../../../src/renderer/components/SectionBox';

describe('SectionBox Component - Foundation Tests', () => {
  
  beforeEach(() => {
    // Clear any console spies between tests
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children correctly', () => {
      render(
        <SectionBox id="test-section" type="hero">
          <div data-testid="child">Test Content</div>
        </SectionBox>
      );
      
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Test Content');
    });

    it('should render as a section element', () => {
      render(
        <SectionBox id="test-section" type="hero">
          <div data-testid="child">Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section.tagName).toBe('SECTION');
    });

    it('should apply correct data attributes', () => {
      render(
        <SectionBox id="test-section" type="hero" data-selected={true}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toHaveAttribute('data-sb-section', 'hero');
      expect(section).toHaveAttribute('data-sb-id', 'test-section');
      expect(section).toHaveAttribute('data-selected', 'true');
    });

    it('should apply custom className', () => {
      render(
        <SectionBox id="test" type="hero" className="custom-class">
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toHaveClass('custom-class');
    });

    it('should apply aria-label for accessibility', () => {
      render(
        <SectionBox id="test" type="hero" aria-label="Hero Section">
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toHaveAttribute('aria-label', 'Hero Section');
    });
  });

  describe('CSS Variable Handling', () => {
    it('should apply valid CSS custom properties', () => {
      const validVars = {
        '--sb-color-brand': '#ff0000',
        '--sb-font-size': '24px',
        '--sb-margin': '16px',
      };
      
      render(
        <SectionBox id="test" type="hero" vars={validVars}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      const styles = getComputedStyle(section);
      
      // Note: jsdom doesn't fully support CSS custom properties in getComputedStyle
      // but we can check the style attribute directly
      expect(section.style.getPropertyValue('--sb-color-brand')).toBe('#ff0000');
      expect(section.style.getPropertyValue('--sb-font-size')).toBe('24px');
      expect(section.style.getPropertyValue('--sb-margin')).toBe('16px');
    });

    it('should warn about invalid CSS properties and not apply them', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const invalidVars = {
        '--sb-valid': 'valid-value',
        'color': 'red',          // Invalid: no --sb- prefix
        'fontSize': '20px',      // Invalid: camelCase property
        'margin-top': '10px',    // Invalid: regular CSS property
      };
      
      render(
        <SectionBox id="test" type="hero" vars={invalidVars}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      
      // Valid variable should be applied
      expect(section.style.getPropertyValue('--sb-valid')).toBe('valid-value');
      
      // Invalid variables should not be applied
      expect(section.style.getPropertyValue('color')).toBe('');
      expect(section.style.getPropertyValue('font-size')).toBe('');
      expect(section.style.getPropertyValue('margin-top')).toBe('');
      
      // Should warn about each invalid property
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid style property "color"')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid style property "fontSize"')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid style property "margin-top"')
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle undefined vars gracefully', () => {
      render(
        <SectionBox id="test" type="hero" vars={undefined}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toBeInTheDocument();
    });

    it('should handle empty vars object', () => {
      render(
        <SectionBox id="test" type="hero" vars={{}}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toBeInTheDocument();
    });

    it('should convert number values to strings', () => {
      const varsWithNumbers = {
        '--sb-opacity': 0.5,
        '--sb-z-index': 100,
        '--sb-width': 300,
      };
      
      render(
        <SectionBox id="test" type="hero" vars={varsWithNumbers}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      
      expect(section.style.getPropertyValue('--sb-opacity')).toBe('0.5');
      expect(section.style.getPropertyValue('--sb-z-index')).toBe('100');
      expect(section.style.getPropertyValue('--sb-width')).toBe('300');
    });
  });

  describe('Framework Discipline Enforcement', () => {
    it('should only accept CSS custom properties starting with --sb-', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mixedVars = {
        '--sb-valid-1': 'valid',
        '--sb-valid-2': 'also-valid',
        '--custom-var': 'invalid',    // Doesn't start with --sb-
        '--theme-color': 'invalid',   // Doesn't start with --sb-
        'regular-prop': 'invalid',    // Not a CSS custom property
      };
      
      render(
        <SectionBox id="test" type="hero" vars={mixedVars}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      // Should warn about each invalid property
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid style property "--custom-var"')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid style property "--theme-color"')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid style property "regular-prop"')
      );
      
      consoleSpy.mockRestore();
    });

    it('should provide helpful error messages for violations', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <SectionBox id="test" type="hero" vars={{ 'backgroundColor': 'red' }}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Only CSS custom properties (--sb-*) are allowed')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Use mapSectionVars to convert props to variables')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Data Attributes for Debugging', () => {
    it('should set section type in data attribute', () => {
      render(
        <SectionBox id="test" type="content_block">
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toHaveAttribute('data-sb-section', 'content_block');
    });

    it('should set section ID in data attribute', () => {
      render(
        <SectionBox id="hero-123" type="hero">
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).toHaveAttribute('data-sb-id', 'hero-123');
    });

    it('should conditionally set selected state', () => {
      const { rerender } = render(
        <SectionBox id="test" type="hero" data-selected={false}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      let section = document.querySelector('section')!;
      expect(section).toHaveAttribute('data-selected', 'false');
      
      rerender(
        <SectionBox id="test" type="hero" data-selected={true}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      section = document.querySelector('section')!;
      expect(section).toHaveAttribute('data-selected', 'true');
    });

    it('should not set selected attribute when not provided', () => {
      render(
        <SectionBox id="test" type="hero">
          <div>Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      expect(section).not.toHaveAttribute('data-selected');
    });
  });

  describe('Utility Functions', () => {
    describe('validateSectionVars', () => {
      it('should return true for valid variables', () => {
        const validVars = {
          '--sb-color': 'red',
          '--sb-size': '20px',
          '--sb-opacity': 0.5,
        };
        
        const result = validateSectionVars(validVars);
        expect(result).toBe(true);
      });

      it('should return false and log errors for invalid variables', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        
        const invalidVars = {
          '--sb-valid': 'valid',
          'invalid': 'invalid',
        };
        
        const result = validateSectionVars(invalidVars);
        
        expect(result).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid CSS variable "invalid"')
        );
        
        consoleErrorSpy.mockRestore();
      });
    });

    describe('debugSectionVars', () => {
      it('should log section variables in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        
        const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
        
        const vars = {
          '--sb-color': 'red',
          '--sb-size': '20px',
          'invalid': 'should-warn',
        };
        
        debugSectionVars('hero', vars);
        
        expect(consoleGroupSpy).toHaveBeenCalledWith(
          expect.stringContaining('Section variables for hero')
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('✅ --sb-color: red')
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('❌ invalid: should-warn'),
          expect.stringContaining('Invalid: must start with --sb-')
        );
        expect(consoleGroupEndSpy).toHaveBeenCalled();
        
        consoleGroupSpy.mockRestore();
        consoleLogSpy.mockRestore();
        consoleGroupEndSpy.mockRestore();
        process.env.NODE_ENV = originalEnv;
      });

      it('should not log in production mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        
        const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
        
        debugSectionVars('hero', { '--sb-color': 'red' });
        
        expect(consoleGroupSpy).not.toHaveBeenCalled();
        
        consoleGroupSpy.mockRestore();
        process.env.NODE_ENV = originalEnv;
      });

      it('should handle empty variables object', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        
        debugSectionVars('hero', {});
        
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'No section variables applied (using theme/token defaults)'
        );
        
        consoleLogSpy.mockRestore();
        process.env.NODE_ENV = originalEnv;
      });
    });
  });

  describe('Integration with CSS Variable Cascade', () => {
    it('should provide highest priority in variable cascade', () => {
      // This test verifies that section variables override theme variables
      // by checking the style attribute directly (highest specificity)
      
      render(
        <SectionBox 
          id="test" 
          type="hero" 
          vars={{ 
            '--sb-color-brand': '#section-override',
            '--sb-font-size': '32px' 
          }}
        >
          <div data-testid="content">Test Content</div>
        </SectionBox>
      );
      
      const section = document.querySelector('section')!;
      
      // Section variables should be applied directly to the element
      expect(section.style.getPropertyValue('--sb-color-brand')).toBe('#section-override');
      expect(section.style.getPropertyValue('--sb-font-size')).toBe('32px');
    });

    it('should work correctly when nested inside other elements', () => {
      render(
        <div style={{ '--sb-color-brand': 'theme-value' } as React.CSSProperties}>
          <SectionBox 
            id="test" 
            type="hero" 
            vars={{ '--sb-color-brand': 'section-value' }}
          >
            <div data-testid="content">Test Content</div>
          </SectionBox>
        </div>
      );
      
      const section = document.querySelector('section')!;
      
      // Section value should take precedence due to cascade specificity
      expect(section.style.getPropertyValue('--sb-color-brand')).toBe('section-value');
    });
  });

  describe('Performance', () => {
    it('should handle large numbers of variables efficiently', () => {
      const start = performance.now();
      
      // Create 100 variables
      const manyVars: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        manyVars[`--sb-var-${i}`] = `value-${i}`;
      }
      
      render(
        <SectionBox id="test" type="hero" vars={manyVars}>
          <div>Test Content</div>
        </SectionBox>
      );
      
      const end = performance.now();
      const duration = end - start;
      
      // Should render with 100 variables in under 50ms
      expect(duration).toBeLessThan(50);
    });

    it('should not cause excessive re-renders', () => {
      const renderSpy = jest.fn();
      
      function TestChild() {
        renderSpy();
        return <div>Child</div>;
      }
      
      const { rerender } = render(
        <SectionBox id="test" type="hero" vars={{ '--sb-color': 'red' }}>
          <TestChild />
        </SectionBox>
      );
      
      // Change variables
      rerender(
        <SectionBox id="test" type="hero" vars={{ '--sb-color': 'blue' }}>
          <TestChild />
        </SectionBox>
      );
      
      // Should only render twice (initial + prop change)
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
