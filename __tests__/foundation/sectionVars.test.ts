/**
 * Section Variables Mapping Tests - Foundation Layer
 * 
 * Tests the prop-to-CSS-variable mapping system that converts
 * section configuration into CSS custom properties.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import {
  varsForHero,
  varsForContentBlock,
  varsForBusinessData,
  varsForSpecialOffers,
  varsForLinksPage,
  varsForSchedule,
  mapSectionVars,
  validateAndLogSectionVars,
} from '../../src/renderer/utils/mapSectionVars';

import type { HeroSection, ContentBlockSection } from '../../src/renderer/types';

describe('Section Variables Mapping - Foundation Tests', () => {
  
  describe('CSS Variable Naming Compliance', () => {
    it('should only generate variables with --sb- prefix from varsForHero', () => {
      const heroSection: HeroSection = {
        id: 'test',
        type: 'hero',
        title: 'Test Title',
        align: 'center',
        valign: 'center',
        brandEmphasis: true,
      };
      
      const result = varsForHero(heroSection);
      const allKeys = Object.keys(result);
      const invalidKeys = allKeys.filter(key => !key.startsWith('--sb-'));
      
      expect(invalidKeys).toHaveLength(0);
    });

    it('should only generate variables with --sb- prefix from varsForContentBlock', () => {
      const contentSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        title: 'Test Title',
        layout: 'media_left',
        background: 'alt',
        brandEmphasis: true,
      };
      
      const result = varsForContentBlock(contentSection);
      const allKeys = Object.keys(result);
      const invalidKeys = allKeys.filter(key => !key.startsWith('--sb-'));
      
      expect(invalidKeys).toHaveLength(0);
    });

    it('should validate section variables and warn about invalid ones', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const invalidVars = {
        '--sb-valid': 'value',
        'invalid-key': 'value',
        'color': 'red',
      };
      
      validateAndLogSectionVars('test', invalidVars);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid CSS variables in test'),
        ['invalid-key', 'color'],
        expect.stringContaining('must start with "--sb-"')
      );
      
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('varsForHero', () => {
    it('should map text alignment props to CSS variables', () => {
      const section: HeroSection = {
        id: 'test',
        type: 'hero',
        align: 'center',
        valign: 'bottom',
      };
      
      const result = varsForHero(section);
      
      expect(result['--sb-justify-content']).toBe('center');
      expect(result['--sb-text-align']).toBe('center');
      expect(result['--sb-align-items']).toBe('flex-end');
    });

    it('should map background image and focal point', () => {
      const section: HeroSection = {
        id: 'test',
        type: 'hero',
        backgroundImageUrl: 'https://example.com/bg.jpg',
        backgroundFocal: {
          desktop: { xPct: 75, yPct: 25 },
          mobile: { xPct: 50, yPct: 50 },
        },
      };
      
      const result = varsForHero(section);
      
      expect(result['--sb-hero-bg-image']).toBe('url("https://example.com/bg.jpg")');
      expect(result['--sb-hero-bg-position']).toBe('75% 25%');
      expect(result['--sb-hero-bg-position-mobile']).toBe('50% 50%');
    });

    it('should map image overlay settings', () => {
      const section: HeroSection = {
        id: 'test',
        type: 'hero',
        imageOverlay: {
          type: 'dark',
          intensity: 'heavy',
        },
      };
      
      const result = varsForHero(section);
      
      expect(result['--sb-hero-overlay']).toBe('rgba(0, 0, 0, 0.6)');
    });

    it('should map content image with aspect ratio and size', () => {
      const section: HeroSection = {
        id: 'test',
        type: 'hero',
        contentImageUrl: 'https://example.com/content.jpg',
        contentImageRatio: '16x9',
        contentImageFit: 'cover',
        contentImageSize: 'L',
      };
      
      const result = varsForHero(section);
      
      expect(result['--sb-hero-content-image']).toBe('url("https://example.com/content.jpg")');
      expect(result['--sb-hero-content-aspect']).toBe('16 / 9');
      expect(result['--sb-hero-content-fit']).toBe('cover');
      expect(result['--sb-hero-content-size']).toBe('400px');
    });

    it('should apply brand emphasis styling', () => {
      const section: HeroSection = {
        id: 'test',
        type: 'hero',
        brandEmphasis: true,
      };
      
      const result = varsForHero(section);
      
      expect(result['--sb-hero-title-color']).toBe('var(--sb-color-brand)');
    });

    it('should map text color modes', () => {
      const brandSection: HeroSection = {
        id: 'test',
        type: 'hero',
        textColorMode: 'brand',
      };
      
      const neutralSection: HeroSection = {
        id: 'test',
        type: 'hero',
        textColorMode: 'neutral',
      };
      
      const brandResult = varsForHero(brandSection);
      const neutralResult = varsForHero(neutralSection);
      
      expect(brandResult['--sb-hero-text-color']).toBe('var(--sb-color-brand)');
      expect(neutralResult['--sb-hero-text-color']).toBe('var(--sb-color-neutral)');
    });

    it('should apply adaptive title scaling for long titles', () => {
      const longTitleSection: HeroSection = {
        id: 'test',
        type: 'hero',
        title: 'This is a very long title that should trigger adaptive scaling because it exceeds the character threshold',
      };
      
      const result = varsForHero(longTitleSection);
      
      expect(result['--sb-hero-title-adaptive']).toBe('0.8');
    });

    it('should handle typography overrides', () => {
      const section: HeroSection = {
        id: 'test',
        type: 'hero',
        typographyOverride: {
          displayScale: 'dramatic',
          customScaling: {
            title: 1.5,
          },
        },
      };
      
      const result = varsForHero(section);
      
      expect(result['--sb-title-mult']).toBe('1.5');
    });
  });

  describe('varsForContentBlock', () => {
    it('should map layout configurations', () => {
      const leftLayout: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        layout: 'media_left',
      };
      
      const rightLayout: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        layout: 'media_right',
      };
      
      const topLayout: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        layout: 'media_top',
      };
      
      const leftResult = varsForContentBlock(leftLayout);
      const rightResult = varsForContentBlock(rightLayout);
      const topResult = varsForContentBlock(topLayout);
      
      expect(leftResult['--sb-cb-grid']).toBe('1fr 1fr');
      expect(leftResult['--sb-cb-media-order']).toBe('1');
      expect(leftResult['--sb-cb-text-order']).toBe('2');
      
      expect(rightResult['--sb-cb-grid']).toBe('1fr 1fr');
      expect(rightResult['--sb-cb-media-order']).toBe('2');
      expect(rightResult['--sb-cb-text-order']).toBe('1');
      
      expect(topResult['--sb-cb-grid']).toBe('1fr');
      expect(topResult['--sb-cb-media-order']).toBe('1');
      expect(topResult['--sb-cb-text-order']).toBe('2');
    });

    it('should map background settings', () => {
      const altBgSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        background: 'alt',
      };
      
      const inverseBgSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        background: 'inverse',
      };
      
      const altResult = varsForContentBlock(altBgSection);
      const inverseResult = varsForContentBlock(inverseBgSection);
      
      expect(altResult['--sb-bg-color']).toBe('var(--sb-color-surface-alt)');
      expect(altResult['--sb-text-color']).toBe('var(--sb-color-text)');
      
      expect(inverseResult['--sb-bg-color']).toBe('var(--sb-color-text)');
      expect(inverseResult['--sb-text-color']).toBe('var(--sb-color-surface)');
    });

    it('should map text alignment', () => {
      const section: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        textAlign: 'center',
      };
      
      const result = varsForContentBlock(section);
      
      expect(result['--sb-cb-text-align']).toBe('center');
    });

    it('should map figure sizes', () => {
      const smallSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        figureSize: 'S',
      };
      
      const largeSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        figureSize: 'L',
      };
      
      const smallResult = varsForContentBlock(smallSection);
      const largeResult = varsForContentBlock(largeSection);
      
      expect(smallResult['--sb-cb-figure-max-width']).toBe('300px');
      expect(largeResult['--sb-cb-figure-max-width']).toBe('700px');
    });

    it('should handle multi-image grids', () => {
      const twoImageSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        media: [
          { url: 'image1.jpg', alt: 'Image 1' },
          { url: 'image2.jpg', alt: 'Image 2' },
        ],
      };
      
      const threeImageSection: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        media: [
          { url: 'image1.jpg', alt: 'Image 1' },
          { url: 'image2.jpg', alt: 'Image 2' },
          { url: 'image3.jpg', alt: 'Image 3' },
        ],
      };
      
      const twoResult = varsForContentBlock(twoImageSection);
      const threeResult = varsForContentBlock(threeImageSection);
      
      expect(twoResult['--sb-cb-media-count']).toBe('2');
      expect(twoResult['--sb-cb-media-grid']).toBe('1fr 1fr');
      
      expect(threeResult['--sb-cb-media-count']).toBe('3');
      expect(threeResult['--sb-cb-media-grid']).toBe('1fr 1fr 1fr');
    });

    it('should apply brand emphasis', () => {
      const section: ContentBlockSection = {
        id: 'test',
        type: 'content_block',
        brandEmphasis: true,
      };
      
      const result = varsForContentBlock(section);
      
      expect(result['--sb-cb-title-color']).toBe('var(--sb-color-brand)');
    });
  });

  describe('Stub Section Mappers', () => {
    it('should generate basic variables for business data section', () => {
      const section = {
        id: 'test',
        type: 'business_data' as const,
      };
      
      const result = varsForBusinessData(section);
      
      expect(result['--sb-bg-color']).toBe('var(--sb-color-surface)');
      expect(result['--sb-bd-padding']).toBe('var(--sb-space-section)');
    });

    it('should generate basic variables for special offers section', () => {
      const section = {
        id: 'test',
        type: 'special_offers' as const,
        offers: [
          { title: 'Offer 1', description: 'Description 1' },
          { title: 'Offer 2', description: 'Description 2' },
        ],
      };
      
      const result = varsForSpecialOffers(section);
      
      expect(result['--sb-bg-color']).toBe('var(--sb-color-surface)');
      expect(result['--sb-so-padding']).toBe('var(--sb-space-section)');
      expect(result['--sb-so-grid-cols']).toBe('2');
    });

    it('should generate basic variables for links page section', () => {
      const section = {
        id: 'test',
        type: 'links_page' as const,
      };
      
      const result = varsForLinksPage(section);
      
      expect(result['--sb-bg-color']).toBe('var(--sb-color-surface)');
      expect(result['--sb-lp-padding']).toBe('var(--sb-space-section)');
      expect(result['--sb-lp-max-width']).toBe('600px');
    });

    it('should generate basic variables for schedule section', () => {
      const section = {
        id: 'test',
        type: 'schedule' as const,
        viewMode: 'calendar',
      };
      
      const result = varsForSchedule(section);
      
      expect(result['--sb-bg-color']).toBe('var(--sb-color-surface)');
      expect(result['--sb-sc-padding']).toBe('var(--sb-space-section)');
      expect(result['--sb-sc-view-mode']).toBe('calendar');
    });
  });

  describe('mapSectionVars Generic Mapper', () => {
    it('should delegate to correct specific mapper based on section type', () => {
      const heroSection = {
        id: 'test',
        type: 'hero' as const,
        align: 'center' as const,
      };
      
      const contentSection = {
        id: 'test',
        type: 'content_block' as const,
        layout: 'media_left' as const,
      };
      
      const heroResult = mapSectionVars(heroSection);
      const contentResult = mapSectionVars(contentSection);
      
      expect(heroResult['--sb-justify-content']).toBe('center');
      expect(contentResult['--sb-cb-grid']).toBe('1fr 1fr');
    });

    it('should warn and provide fallback for unknown section types', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const unknownSection = {
        id: 'test',
        type: 'unknown_type' as any,
      };
      
      const result = mapSectionVars(unknownSection);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown section type "unknown_type"')
      );
      expect(result['--sb-padding']).toBe('var(--sb-space-section)');
      
      consoleSpy.mockRestore();
    });

    it('should handle errors gracefully and provide safe fallback', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Create a section that might cause an error in the mapper
      const problematicSection = null as any;
      
      const result = mapSectionVars(problematicSection);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result['--sb-padding']).toBe('var(--sb-space-section)');
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Image Overlay Mapping', () => {
    it('should map dark overlay with different intensities', () => {
      const lightOverlay: HeroSection = {
        id: 'test',
        type: 'hero',
        imageOverlay: { type: 'dark', intensity: 'light' },
      };
      
      const heavyOverlay: HeroSection = {
        id: 'test',
        type: 'hero',
        imageOverlay: { type: 'dark', intensity: 'heavy' },
      };
      
      const lightResult = varsForHero(lightOverlay);
      const heavyResult = varsForHero(heavyOverlay);
      
      expect(lightResult['--sb-hero-overlay']).toBe('rgba(0, 0, 0, 0.2)');
      expect(heavyResult['--sb-hero-overlay']).toBe('rgba(0, 0, 0, 0.6)');
    });

    it('should map gradient overlays with directions', () => {
      const bottomGradient: HeroSection = {
        id: 'test',
        type: 'hero',
        imageOverlay: {
          type: 'gradient',
          intensity: 'medium',
          gradientDirection: 'bottom',
        },
      };
      
      const centerGradient: HeroSection = {
        id: 'test',
        type: 'hero',
        imageOverlay: {
          type: 'gradient',
          intensity: 'medium',
          gradientDirection: 'center',
        },
      };
      
      const bottomResult = varsForHero(bottomGradient);
      const centerResult = varsForHero(centerGradient);
      
      expect(bottomResult['--sb-hero-overlay']).toContain('linear-gradient(to bottom');
      expect(centerResult['--sb-hero-overlay']).toContain('radial-gradient(circle');
    });

    it('should handle no overlay gracefully', () => {
      const noOverlay: HeroSection = {
        id: 'test',
        type: 'hero',
        imageOverlay: { type: 'none' },
      };
      
      const result = varsForHero(noOverlay);
      
      expect(result['--sb-hero-overlay']).toBe('transparent');
    });
  });

  describe('Performance', () => {
    it('should handle large section configurations efficiently', () => {
      const start = performance.now();
      
      // Generate variables for 100 complex sections
      for (let i = 0; i < 100; i++) {
        const heroSection: HeroSection = {
          id: `test-${i}`,
          type: 'hero',
          title: `Title ${i}`.repeat(10), // Long title to trigger adaptive scaling
          subtitle: `Subtitle ${i}`,
          align: 'center',
          valign: 'center',
          brandEmphasis: true,
          backgroundImageUrl: 'https://example.com/bg.jpg',
          backgroundFocal: {
            desktop: { xPct: 50, yPct: 50 },
            mobile: { xPct: 50, yPct: 50 },
          },
          imageOverlay: {
            type: 'gradient',
            intensity: 'medium',
            gradientDirection: 'bottom',
          },
          typographyOverride: {
            displayScale: 'dramatic',
            textScale: 'comfortable',
          },
        };
        
        varsForHero(heroSection);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete 100 complex variable generations in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
