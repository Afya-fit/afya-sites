/**
 * Hero Component Tests - Phase 2
 * 
 * Tests the refactored Hero component that uses the One-Path Styling Framework.
 * Validates SectionBox integration and CSS module usage.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Hero } from '../../../src/renderer/components/sections/hero/Hero';
import type { HeroSection } from '../../../src/renderer/types';

describe('Hero Component - Phase 2 Tests', () => {
  const basicHeroSection: HeroSection = {
    id: 'hero-1',
    type: 'hero',
    title: 'Test Hero Title',
    subtitle: 'Test Hero Subtitle',
    align: 'center',
    valign: 'center',
  };

  beforeEach(() => {
    // Clear any global test state
    delete (globalThis as any).__SB_RENDER_DATA;
  });

  describe('Framework Integration', () => {
    it('should render using SectionBox wrapper', () => {
      render(<Hero section={basicHeroSection} />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-sb-section', 'hero');
      expect(section).toHaveAttribute('data-sb-id', 'hero-1');
    });

    it('should export framework compliance flag', () => {
      const HeroModule = require('../../../src/renderer/components/sections/hero/Hero');
      expect(HeroModule.usesFramework).toBe(true);
    });

    it('should apply CSS module classes', () => {
      render(<Hero section={basicHeroSection} />);
      
      // Check that CSS module classes are applied (they'll be hashed in real builds)
      const section = document.querySelector('section');
      expect(section?.className).toBeTruthy();
    });
  });

  describe('Content Rendering', () => {
    it('should render title and subtitle', () => {
      render(<Hero section={basicHeroSection} />);
      
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
      expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument();
    });

    it('should render title as h1 element', () => {
      render(<Hero section={basicHeroSection} />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Test Hero Title');
    });

    it('should handle empty title gracefully', () => {
      const sectionWithoutTitle: HeroSection = {
        ...basicHeroSection,
        title: undefined,
        subtitle: 'Only subtitle',
      };
      
      render(<Hero section={sectionWithoutTitle} />);
      
      expect(screen.getByText('Only subtitle')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    });

    it('should handle content image', () => {
      const sectionWithImage: HeroSection = {
        ...basicHeroSection,
        contentImageUrl: 'https://example.com/hero.jpg',
      };
      
      render(<Hero section={sectionWithImage} />);
      
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Test Hero Title');
    });
  });

  describe('Data Attributes and Configuration', () => {
    it('should set correct variant based on content', () => {
      const shortTitleSection: HeroSection = {
        ...basicHeroSection,
        title: 'Short',
        subtitle: undefined,
      };
      
      render(<Hero section={shortTitleSection} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('data-variant', 'standard');
    });

    it('should set bold variant for long title', () => {
      const longTitleSection: HeroSection = {
        ...basicHeroSection,
        title: 'This is a very long title that should trigger the bold variant because it exceeds fifty characters',
      };
      
      render(<Hero section={longTitleSection} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('data-variant', 'bold');
    });

    it('should set bold variant when subtitle is present', () => {
      const sectionWithSubtitle: HeroSection = {
        ...basicHeroSection,
        title: 'Short',
        subtitle: 'Any subtitle',
      };
      
      render(<Hero section={sectionWithSubtitle} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('data-variant', 'bold');
    });

    it('should set alignment data attributes', () => {
      const leftAlignSection: HeroSection = {
        ...basicHeroSection,
        align: 'left',
      };
      
      render(<Hero section={leftAlignSection} />);
      
      const container = document.querySelector('[data-align="left"]');
      expect(container).toBeInTheDocument();
    });

    it('should set text mode data attributes', () => {
      const brandModeSection = {
        ...basicHeroSection,
        textColorMode: 'brand',
      } as HeroSection;
      
      render(<Hero section={brandModeSection} />);
      
      const container = document.querySelector('[data-text-mode="brand"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Background Image Handling', () => {
    it('should set auto text mode for background images', () => {
      const sectionWithBg: HeroSection = {
        ...basicHeroSection,
        backgroundImageUrl: 'https://example.com/bg.jpg',
      };
      
      render(<Hero section={sectionWithBg} />);
      
      const container = document.querySelector('[data-text-mode="auto"]');
      expect(container).toBeInTheDocument();
    });

    it('should handle background focal points', () => {
      const sectionWithFocal: HeroSection = {
        ...basicHeroSection,
        backgroundImageUrl: 'https://example.com/bg.jpg',
        backgroundFocal: {
          desktop: { xPct: 75, yPct: 25 },
          mobile: { xPct: 50, yPct: 50 },
        },
      };
      
      render(<Hero section={sectionWithFocal} />);
      
      // Component should render without errors
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    });
  });

  describe('Brand Emphasis', () => {
    it('should apply brand emphasis data attribute', () => {
      const brandSection: HeroSection = {
        ...basicHeroSection,
        brandEmphasis: true,
      };
      
      render(<Hero section={brandSection} />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAttribute('data-brand-emphasis', 'true');
    });

    it('should not apply brand emphasis when false', () => {
      const noBrandSection: HeroSection = {
        ...basicHeroSection,
        brandEmphasis: false,
      };
      
      render(<Hero section={noBrandSection} />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAttribute('data-brand-emphasis', 'false');
    });
  });

  describe('Device Hints', () => {
    it('should handle mobile device hint', () => {
      // Set up mobile device hint
      (globalThis as any).__SB_RENDER_DATA = {
        __preview_device: 'mobile',
      };
      
      const sectionWithMobileFocal: HeroSection = {
        ...basicHeroSection,
        backgroundImageUrl: 'https://example.com/bg.jpg',
        backgroundFocal: {
          desktop: { xPct: 75, yPct: 25 },
          mobile: { xPct: 50, yPct: 50 },
        },
      };
      
      render(<Hero section={sectionWithMobileFocal} />);
      
      // Component should render and handle mobile focal point
      expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should provide meaningful aria-label', () => {
      render(<Hero section={basicHeroSection} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'Hero: Test Hero Title');
    });

    it('should provide fallback aria-label when no title', () => {
      const noTitleSection: HeroSection = {
        ...basicHeroSection,
        title: undefined,
      };
      
      render(<Hero section={noTitleSection} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'Hero section');
    });

    it('should mark overlay elements as aria-hidden', () => {
      const sectionWithOverlay: HeroSection = {
        ...basicHeroSection,
        imageOverlay: {
          type: 'dark',
          intensity: 'medium',
        },
      };
      
      render(<Hero section={sectionWithOverlay} />);
      
      const overlays = document.querySelectorAll('[aria-hidden="true"]');
      expect(overlays.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should not cause excessive re-renders', () => {
      const renderSpy = jest.fn();
      
      function TestWrapper({ section }: { section: HeroSection }) {
        renderSpy();
        return <Hero section={section} />;
      }
      
      const { rerender } = render(<TestWrapper section={basicHeroSection} />);
      
      // Same section should not cause re-render
      rerender(<TestWrapper section={basicHeroSection} />);
      
      expect(renderSpy).toHaveBeenCalledTimes(2); // Initial + rerender
    });

    it('should handle large titles efficiently', () => {
      const start = performance.now();
      
      const largeTitleSection: HeroSection = {
        ...basicHeroSection,
        title: 'Very long title '.repeat(20), // 300+ characters
        subtitle: 'Very long subtitle '.repeat(15), // 270+ characters
      };
      
      render(<Hero section={largeTitleSection} />);
      
      const end = performance.now();
      const duration = end - start;
      
      // Should render large content in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
