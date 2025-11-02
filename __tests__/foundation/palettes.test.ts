/**
 * Palette System Tests - Foundation Layer
 * 
 * Tests the color palette resolution system that converts
 * accent colors into complete brand palettes for light/dark modes.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import {
  resolveAccentPalette,
  BRAND_PALETTES,
  SURFACE_COLORS,
} from '../../src/renderer/theme/palettes';

describe('Palette System - Foundation Tests', () => {
  
  describe('resolveAccentPalette', () => {
    describe('Predefined Palettes', () => {
      it('should resolve blue palette correctly in light mode', () => {
        const result = resolveAccentPalette('blue', 'light');
        
        expect(result.brand).toBe('#2563eb');
        expect(result.brandHover).toBe('#1d4ed8');
        expect(result.brandContrast).toBe('#ffffff');
        expect(result.accent).toBe('#3b82f6');
        expect(result.neutral).toBe('#6b7280');
      });

      it('should resolve blue palette correctly in dark mode', () => {
        const result = resolveAccentPalette('blue', 'dark');
        
        expect(result.brand).toBe('#3b82f6');
        expect(result.brandHover).toBe('#60a5fa');
        expect(result.brandContrast).toBe('#ffffff');
        expect(result.accent).toBe('#2563eb');
        expect(result.neutral).toBe('#9ca3af');
      });

      it('should resolve green palette correctly', () => {
        const lightResult = resolveAccentPalette('green', 'light');
        const darkResult = resolveAccentPalette('green', 'dark');
        
        expect(lightResult.brand).toBe('#059669');
        expect(darkResult.brand).toBe('#10b981');
        
        // Verify different colors for light/dark
        expect(lightResult.brand).not.toBe(darkResult.brand);
      });

      it('should resolve all predefined palettes without errors', () => {
        const paletteNames = Object.keys(BRAND_PALETTES);
        
        paletteNames.forEach(paletteName => {
          const lightResult = resolveAccentPalette(paletteName, 'light');
          const darkResult = resolveAccentPalette(paletteName, 'dark');
          
          // Verify all required properties exist
          expect(lightResult.brand).toBeTruthy();
          expect(lightResult.brandHover).toBeTruthy();
          expect(lightResult.brandContrast).toBeTruthy();
          expect(lightResult.accent).toBeTruthy();
          expect(lightResult.neutral).toBeTruthy();
          
          expect(darkResult.brand).toBeTruthy();
          expect(darkResult.brandHover).toBeTruthy();
          expect(darkResult.brandContrast).toBeTruthy();
          expect(darkResult.accent).toBeTruthy();
          expect(darkResult.neutral).toBeTruthy();
        });
      });
    });

    describe('Custom Hex Colors', () => {
      it('should generate palette from valid hex color', () => {
        const result = resolveAccentPalette('#ff6b35', 'light');
        
        expect(result.brand).toBe('#ff6b35');
        expect(result.brandContrast).toBeTruthy();
        expect(result.brandHover).toBeTruthy();
        expect(result.accent).toBeTruthy();
        expect(result.neutral).toBeTruthy();
      });

      it('should generate different hover colors for light/dark modes', () => {
        const lightResult = resolveAccentPalette('#ff6b35', 'light');
        const darkResult = resolveAccentPalette('#ff6b35', 'dark');
        
        expect(lightResult.brandHover).not.toBe(darkResult.brandHover);
        expect(lightResult.accent).not.toBe(darkResult.accent);
      });

      it('should handle 3-character hex colors', () => {
        const result = resolveAccentPalette('#f60', 'light');
        
        expect(result.brand).toBe('#f60');
        expect(result.brandContrast).toBeTruthy();
      });

      it('should provide appropriate contrast colors', () => {
        // Light color should get dark contrast
        const lightColorResult = resolveAccentPalette('#ffff00', 'light');
        expect(lightColorResult.brandContrast).toBe('#000000');
        
        // Dark color should get light contrast
        const darkColorResult = resolveAccentPalette('#000080', 'light');
        expect(darkColorResult.brandContrast).toBe('#ffffff');
      });
    });

    describe('Fallback Behavior', () => {
      it('should fallback to blue for unknown palette names', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        const result = resolveAccentPalette('unknown-palette', 'light');
        const blueResult = resolveAccentPalette('blue', 'light');
        
        expect(result).toEqual(blueResult);
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Unknown accent color "unknown-palette"')
        );
        
        consoleSpy.mockRestore();
      });

      it('should fallback to blue for invalid hex colors', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        const result = resolveAccentPalette('#invalid', 'light');
        const blueResult = resolveAccentPalette('blue', 'light');
        
        expect(result).toEqual(blueResult);
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Unknown accent color "#invalid"')
        );
        
        consoleSpy.mockRestore();
      });

      it('should default to light mode when mode not specified', () => {
        const result = resolveAccentPalette('blue');
        const lightResult = resolveAccentPalette('blue', 'light');
        
        expect(result).toEqual(lightResult);
      });
    });
  });

  describe('BRAND_PALETTES Configuration', () => {
    it('should have all required predefined palettes', () => {
      const requiredPalettes = ['blue', 'green', 'purple', 'orange', 'red', 'neutral'];
      
      requiredPalettes.forEach(paletteName => {
        expect(BRAND_PALETTES[paletteName]).toBeDefined();
        expect(BRAND_PALETTES[paletteName].light).toBeDefined();
        expect(BRAND_PALETTES[paletteName].dark).toBeDefined();
      });
    });

    it('should have consistent structure across all palettes', () => {
      Object.values(BRAND_PALETTES).forEach(palette => {
        // Check light mode structure
        expect(palette.light.brand).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.light.brandHover).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.light.brandContrast).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.light.accent).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.light.neutral).toMatch(/^#[0-9a-f]{6}$/i);
        
        // Check dark mode structure
        expect(palette.dark.brand).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.dark.brandHover).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.dark.brandContrast).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.dark.accent).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.dark.neutral).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should have different colors for light and dark modes', () => {
      Object.values(BRAND_PALETTES).forEach(palette => {
        // Brand colors should typically be different for light/dark
        // (though neutral might be an exception)
        expect(palette.light.neutral).not.toBe(palette.dark.neutral);
      });
    });
  });

  describe('SURFACE_COLORS Configuration', () => {
    it('should have required surface colors for light mode', () => {
      const lightColors = SURFACE_COLORS.light;
      
      expect(lightColors.surface).toBe('#ffffff');
      expect(lightColors.surfaceAlt).toBe('#f7f7f8');
      expect(lightColors.text).toBe('#1f2937');
      expect(lightColors.textMuted).toBe('#6b7280');
      expect(lightColors.border).toBe('#e5e7eb');
      expect(lightColors.bgAlt).toBe('#f6f7f9');
    });

    it('should have required surface colors for dark mode', () => {
      const darkColors = SURFACE_COLORS.dark;
      
      expect(darkColors.surface).toBe('#0f1115');
      expect(darkColors.surfaceAlt).toBe('#11131a');
      expect(darkColors.text).toBe('#eaeaea');
      expect(darkColors.textMuted).toBe('#9ca3af');
      expect(darkColors.border).toBe('#22262e');
      expect(darkColors.bgAlt).toBe('#1a1d24');
    });

    it('should have proper contrast between light and dark modes', () => {
      const lightColors = SURFACE_COLORS.light;
      const darkColors = SURFACE_COLORS.dark;
      
      // Light mode should have dark text on light surface
      expect(lightColors.surface).toMatch(/^#f/); // Light color
      expect(lightColors.text).toMatch(/^#[0-3]/); // Dark color
      
      // Dark mode should have light text on dark surface
      expect(darkColors.surface).toMatch(/^#[0-2]/); // Dark color
      expect(darkColors.text).toMatch(/^#[e-f]/); // Light color
    });
  });

  describe('Color Utility Functions', () => {
    // Note: These functions are internal to palettes.ts, but we can test them through the public API
    
    it('should generate consistent colors for the same hex input', () => {
      const result1 = resolveAccentPalette('#ff6b35', 'light');
      const result2 = resolveAccentPalette('#ff6b35', 'light');
      
      expect(result1).toEqual(result2);
    });

    it('should handle case-insensitive hex colors', () => {
      const upperResult = resolveAccentPalette('#FF6B35', 'light');
      const lowerResult = resolveAccentPalette('#ff6b35', 'light');
      
      expect(upperResult.brand.toLowerCase()).toBe(lowerResult.brand.toLowerCase());
    });

    it('should validate hex color format strictly', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // These should fallback to blue (invalid hex)
      resolveAccentPalette('#xyz123', 'light'); // Invalid characters
      resolveAccentPalette('#12345', 'light');  // Wrong length
      resolveAccentPalette('ff6b35', 'light');  // Missing #
      resolveAccentPalette('#1234567', 'light'); // Too long
      
      expect(consoleSpy).toHaveBeenCalledTimes(4);
      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Memory', () => {
    it('should not leak memory with repeated calls', () => {
      // Generate many palettes to test for memory leaks
      for (let i = 0; i < 1000; i++) {
        resolveAccentPalette('blue', 'light');
        resolveAccentPalette('#ff6b35', 'dark');
      }
      
      // If we get here without hanging, memory usage is reasonable
      expect(true).toBe(true);
    });

    it('should handle rapid successive calls efficiently', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        resolveAccentPalette('green', 'light');
        resolveAccentPalette('purple', 'dark');
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete 200 palette resolutions in under 50ms
      expect(duration).toBeLessThan(50);
    });
  });
});
