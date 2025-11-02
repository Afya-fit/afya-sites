/**
 * Typography System Tests - Foundation Layer
 * 
 * Tests the typography utilities that generate CSS variables
 * and ensure correct scaling, font resolution, and configuration.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import {
  generateTypographyVariables,
  generateFontImport,
  generateFontFamilyVariables,
  getAdaptiveTitleMultiplier,
  applyTypographyOverride,
  FONT_PRESETS,
  DISPLAY_SCALES,
  TEXT_SCALES,
  TYPOGRAPHY_MULTIPLIERS,
} from '../../src/renderer/theme/typography';

describe('Typography System - Foundation Tests', () => {
  
  describe('generateTypographyVariables', () => {
    it('should generate standard display and text scale variables', () => {
      const result = generateTypographyVariables({
        preset: 'modern',
        displayScale: 'standard',
        textScale: 'standard',
        adaptiveTitles: true,
      });

      // Verify display scale variables (clamp format)
      expect(result['--sb-fs-hero']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);
      expect(result['--sb-fs-h1']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);
      expect(result['--sb-fs-h2']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);
      expect(result['--sb-fs-h3']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);

      // Verify text scale variables
      expect(result['--sb-fs-body']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);
      expect(result['--sb-fs-subtitle']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);
      expect(result['--sb-fs-small']).toMatch(/^clamp\(\d+px, [\d.]+vw, \d+px\)$/);

      // Verify scale identifiers
      expect(result['--sb-display-scale']).toBe('standard');
      expect(result['--sb-text-scale']).toBe('standard');
      expect(result['--sb-adaptive-titles']).toBe('1');
    });

    it('should generate dramatic display scale with larger font sizes', () => {
      const result = generateTypographyVariables({
        displayScale: 'dramatic',
        textScale: 'standard',
      });

      // Dramatic scale should have larger hero size (64px base vs 48px standard)
      expect(result['--sb-fs-hero']).toBe('clamp(64px, 8vw, 96px)');
      expect(result['--sb-fs-h1']).toBe('clamp(44px, 6vw, 72px)');
    });

    it('should generate comfortable text scale with larger body text', () => {
      const result = generateTypographyVariables({
        displayScale: 'standard',
        textScale: 'comfortable',
      });

      // Comfortable text scale should have larger body text (17px base vs 16px standard)
      expect(result['--sb-fs-body']).toBe('clamp(17px, 3.5vw, 19px)');
      expect(result['--sb-fs-subtitle']).toBe('clamp(19px, 4vw, 24px)');
    });

    it('should handle missing configuration with defaults', () => {
      const result = generateTypographyVariables({});

      // Should default to standard scales
      expect(result['--sb-display-scale']).toBe('standard');
      expect(result['--sb-text-scale']).toBe('standard');
      expect(result['--sb-adaptive-titles']).toBe('1'); // Default true
    });

    it('should disable adaptive titles when requested', () => {
      const result = generateTypographyVariables({
        adaptiveTitles: false,
      });

      expect(result['--sb-adaptive-titles']).toBe('0');
    });
  });

  describe('generateFontImport', () => {
    it('should return correct font import for modern preset', () => {
      const result = generateFontImport('modern');
      expect(result).toContain('@import url');
      expect(result).toContain('Inter');
    });

    it('should return system fonts import (empty) for system preset', () => {
      const result = generateFontImport('system');
      expect(result).toBe('');
    });

    it('should fallback to system fonts for unknown preset', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = generateFontImport('unknown-preset' as any);
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown font preset "unknown-preset"')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('generateFontFamilyVariables', () => {
    it('should generate font family variables for modern preset', () => {
      const result = generateFontFamilyVariables('modern');
      
      expect(result['--sb-font-heading']).toContain('Inter');
      expect(result['--sb-font-body']).toContain('Inter');
    });

    it('should generate different fonts for classic preset', () => {
      const result = generateFontFamilyVariables('classic');
      
      expect(result['--sb-font-heading']).toContain('Playfair Display');
      expect(result['--sb-font-body']).toContain('Source Sans Pro');
    });

    it('should use system fonts for system preset', () => {
      const result = generateFontFamilyVariables('system');
      
      expect(result['--sb-font-heading']).toContain('ui-sans-serif');
      expect(result['--sb-font-body']).toContain('ui-sans-serif');
    });

    it('should fallback to system fonts for unknown preset', () => {
      const result = generateFontFamilyVariables('unknown' as any);
      
      expect(result['--sb-font-heading']).toContain('ui-sans-serif');
      expect(result['--sb-font-body']).toContain('ui-sans-serif');
    });
  });

  describe('getAdaptiveTitleMultiplier', () => {
    it('should return 1 when adaptive titles are disabled', () => {
      const result = getAdaptiveTitleMultiplier('Any text length', false);
      expect(result).toBe(1);
    });

    it('should return 1 for empty or null text', () => {
      expect(getAdaptiveTitleMultiplier('', true)).toBe(1);
      expect(getAdaptiveTitleMultiplier(null as any, true)).toBe(1);
    });

    it('should scale down very long titles (80+ chars)', () => {
      const longTitle = 'This is a very long title that exceeds eighty characters and should be scaled down automatically';
      const result = getAdaptiveTitleMultiplier(longTitle, true);
      expect(result).toBe(0.8);
    });

    it('should scale down long titles (50+ chars)', () => {
      const longTitle = 'This title has exactly sixty-seven characters total for testing';
      const result = getAdaptiveTitleMultiplier(longTitle, true);
      expect(result).toBe(0.9);
    });

    it('should scale up short titles (<15 chars)', () => {
      const shortTitle = 'Short';
      const result = getAdaptiveTitleMultiplier(shortTitle, true);
      expect(result).toBe(1.1);
    });

    it('should use standard size for medium titles (15-50 chars)', () => {
      const mediumTitle = 'This is a medium length title';
      const result = getAdaptiveTitleMultiplier(mediumTitle, true);
      expect(result).toBe(1);
    });
  });

  describe('applyTypographyOverride', () => {
    it('should apply display scale multiplier', () => {
      const vars = {};
      const result = applyTypographyOverride(vars, {
        displayScale: 'dramatic',
      });

      expect(result['--sb-title-mult']).toBe('1.3');
    });

    it('should apply text scale multiplier', () => {
      const vars = {};
      const result = applyTypographyOverride(vars, {
        textScale: 'comfortable',
      });

      expect(result['--sb-text-mult']).toBe('1.1');
    });

    it('should apply custom scaling multipliers', () => {
      const vars = {};
      const result = applyTypographyOverride(vars, {
        customScaling: {
          title: 1.5,
          subtitle: 0.9,
          body: 1.2,
        },
      });

      expect(result['--sb-title-mult']).toBe('1.5');
      expect(result['--sb-subtitle-mult']).toBe('0.9');
      expect(result['--sb-body-mult']).toBe('1.2');
    });

    it('should disable adaptive titles when requested', () => {
      const vars = {};
      const result = applyTypographyOverride(vars, {
        disableAdaptiveTitles: true,
      });

      expect(result['--sb-adaptive-titles']).toBe('0');
    });

    it('should not modify vars when no override provided', () => {
      const vars = { '--existing': 'value' };
      const result = applyTypographyOverride(vars);

      expect(result).toEqual(vars);
    });

    it('should preserve existing vars while adding overrides', () => {
      const vars = { '--existing': 'value' };
      const result = applyTypographyOverride(vars, {
        displayScale: 'compact',
      });

      expect(result['--existing']).toBe('value');
      expect(result['--sb-title-mult']).toBe('0.85');
    });
  });

  describe('Configuration Constants', () => {
    it('should have all required font presets', () => {
      const expectedPresets = ['modern', 'classic', 'minimal', 'energetic', 'friendly', 'system'];
      
      expectedPresets.forEach(preset => {
        expect(FONT_PRESETS[preset]).toBeDefined();
        expect(FONT_PRESETS[preset].heading).toBeTruthy();
        expect(FONT_PRESETS[preset].body).toBeTruthy();
        expect(typeof FONT_PRESETS[preset].import).toBe('string');
      });
    });

    it('should have all required display scales', () => {
      const expectedScales = ['compact', 'standard', 'expressive', 'dramatic'];
      
      expectedScales.forEach(scale => {
        expect(DISPLAY_SCALES[scale]).toBeDefined();
        expect(typeof DISPLAY_SCALES[scale].heroBase).toBe('number');
        expect(typeof DISPLAY_SCALES[scale].heroMax).toBe('number');
        expect(DISPLAY_SCALES[scale].heroMax).toBeGreaterThan(DISPLAY_SCALES[scale].heroBase);
      });
    });

    it('should have all required text scales', () => {
      const expectedScales = ['compact', 'standard', 'comfortable'];
      
      expectedScales.forEach(scale => {
        expect(TEXT_SCALES[scale]).toBeDefined();
        expect(typeof TEXT_SCALES[scale].body.base).toBe('number');
        expect(typeof TEXT_SCALES[scale].body.max).toBe('number');
        expect(TEXT_SCALES[scale].body.max).toBeGreaterThan(TEXT_SCALES[scale].body.base);
      });
    });

    it('should have typography multipliers for all scales', () => {
      // Display scale multipliers
      expect(TYPOGRAPHY_MULTIPLIERS.displayScale.compact).toBe(0.85);
      expect(TYPOGRAPHY_MULTIPLIERS.displayScale.standard).toBe(1);
      expect(TYPOGRAPHY_MULTIPLIERS.displayScale.expressive).toBe(1.15);
      expect(TYPOGRAPHY_MULTIPLIERS.displayScale.dramatic).toBe(1.3);

      // Text scale multipliers
      expect(TYPOGRAPHY_MULTIPLIERS.textScale.compact).toBe(0.9);
      expect(TYPOGRAPHY_MULTIPLIERS.textScale.standard).toBe(1);
      expect(TYPOGRAPHY_MULTIPLIERS.textScale.comfortable).toBe(1.1);
    });
  });

  describe('CSS Variable Naming Compliance', () => {
    it('should only generate variables with --sb- prefix', () => {
      const result = generateTypographyVariables({
        preset: 'modern',
        displayScale: 'dramatic',
        textScale: 'comfortable',
      });

      const allKeys = Object.keys(result);
      const invalidKeys = allKeys.filter(key => !key.startsWith('--sb-'));
      
      expect(invalidKeys).toHaveLength(0);
    });

    it('should generate consistent variable names', () => {
      const result = generateTypographyVariables({});

      // Check that all expected variables are present
      const expectedVars = [
        '--sb-fs-hero',
        '--sb-fs-h1', 
        '--sb-fs-h2',
        '--sb-fs-h3',
        '--sb-fs-body',
        '--sb-fs-subtitle',
        '--sb-fs-small',
        '--sb-display-scale',
        '--sb-text-scale',
        '--sb-adaptive-titles',
      ];

      expectedVars.forEach(varName => {
        expect(result[varName]).toBeDefined();
      });
    });
  });
});
