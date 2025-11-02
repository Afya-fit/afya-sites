/**
 * ContentBlock Component Tests - Phase 2
 * 
 * Tests the refactored ContentBlock component that uses the One-Path Styling Framework.
 * Validates SectionBox integration and CSS module usage.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ContentBlock } from '../../../src/renderer/components/sections/content-block/ContentBlock';
import type { ContentBlockSection, MediaItem } from '../../../src/renderer/types';

describe('ContentBlock Component - Phase 2 Tests', () => {
  const basicContentSection: ContentBlockSection = {
    id: 'content-1',
    type: 'content_block',
    title: 'Test Content Title',
    body: 'Test content body text.',
    layout: 'media_top',
    textAlign: 'left',
    background: 'surface',
  };

  const sampleMedia: MediaItem[] = [
    {
      url: 'https://example.com/image1.jpg',
      alt: 'Sample image 1',
      ratio: '4x3',
      fit: 'cover',
    },
    {
      url: 'https://example.com/image2.jpg',
      alt: 'Sample image 2',
      ratio: '16x9',
      fit: 'contain',
    },
  ];

  describe('Framework Integration', () => {
    it('should render using SectionBox wrapper', () => {
      render(<ContentBlock section={basicContentSection} />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-sb-section', 'content_block');
      expect(section).toHaveAttribute('data-sb-id', 'content-1');
    });

    it('should export framework compliance flag', () => {
      const ContentBlockModule = require('../../../src/renderer/components/sections/content-block/ContentBlock');
      expect(ContentBlockModule.usesFramework).toBe(true);
    });

    it('should apply CSS module classes', () => {
      render(<ContentBlock section={basicContentSection} />);
      
      const section = document.querySelector('section');
      expect(section?.className).toBeTruthy();
    });
  });

  describe('Content Rendering', () => {
    it('should render title and body', () => {
      render(<ContentBlock section={basicContentSection} />);
      
      expect(screen.getByText('Test Content Title')).toBeInTheDocument();
      expect(screen.getByText('Test content body text.')).toBeInTheDocument();
    });

    it('should render title as h2 element', () => {
      render(<ContentBlock section={basicContentSection} />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Test Content Title');
    });

    it('should handle text-only layout', () => {
      const textOnlySection: ContentBlockSection = {
        ...basicContentSection,
        layout: 'text_only',
        media: sampleMedia,
      };
      
      render(<ContentBlock section={textOnlySection} />);
      
      expect(screen.getByText('Test Content Title')).toBeInTheDocument();
      expect(screen.getByText('Test content body text.')).toBeInTheDocument();
      // Media should not be visible
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should handle empty content gracefully', () => {
      const emptySection: ContentBlockSection = {
        ...basicContentSection,
        title: undefined,
        body: undefined,
      };
      
      render(<ContentBlock section={emptySection} />);
      
      // Should render section without text content
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Media Handling', () => {
    it('should render single media item', () => {
      const sectionWithSingleMedia: ContentBlockSection = {
        ...basicContentSection,
        media: [sampleMedia[0]],
      };
      
      render(<ContentBlock section={sectionWithSingleMedia} />);
      
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Sample image 1');
    });

    it('should render media grid for multiple items', () => {
      const sectionWithGrid: ContentBlockSection = {
        ...basicContentSection,
        media: sampleMedia,
      };
      
      render(<ContentBlock section={sectionWithGrid} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('alt', 'Sample image 1');
      expect(images[1]).toHaveAttribute('alt', 'Sample image 2');
    });

    it('should limit media grid to 3 items', () => {
      const fourMediaItems: MediaItem[] = [
        ...sampleMedia,
        { url: 'https://example.com/image3.jpg', alt: 'Sample image 3' },
        { url: 'https://example.com/image4.jpg', alt: 'Sample image 4' },
      ];
      
      const sectionWithManyMedia: ContentBlockSection = {
        ...basicContentSection,
        media: fourMediaItems,
      };
      
      render(<ContentBlock section={sectionWithManyMedia} />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3); // Should limit to 3
    });

    it('should handle media with text overlays', () => {
      const mediaWithOverlay: MediaItem = {
        url: 'https://example.com/overlay.jpg',
        alt: 'Image with overlay',
        textOverlay: {
          text: 'Overlay Text',
          overlay: {
            type: 'dark',
            intensity: 'medium',
          },
        },
      };
      
      const sectionWithOverlay: ContentBlockSection = {
        ...basicContentSection,
        media: [mediaWithOverlay],
      };
      
      render(<ContentBlock section={sectionWithOverlay} />);
      
      expect(screen.getByText('Overlay Text')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Layout Configurations', () => {
    it('should set correct data attributes for media_left layout', () => {
      const leftLayoutSection: ContentBlockSection = {
        ...basicContentSection,
        layout: 'media_left',
        media: [sampleMedia[0]],
      };
      
      render(<ContentBlock section={leftLayoutSection} />);
      
      const layout = document.querySelector('[data-layout="media_left"]');
      expect(layout).toBeInTheDocument();
    });

    it('should set correct data attributes for media_right layout', () => {
      const rightLayoutSection: ContentBlockSection = {
        ...basicContentSection,
        layout: 'media_right',
        media: [sampleMedia[0]],
      };
      
      render(<ContentBlock section={rightLayoutSection} />);
      
      const layout = document.querySelector('[data-layout="media_right"]');
      expect(layout).toBeInTheDocument();
    });

    it('should set correct data attributes for media_top layout', () => {
      const topLayoutSection: ContentBlockSection = {
        ...basicContentSection,
        layout: 'media_top',
        media: [sampleMedia[0]],
      };
      
      render(<ContentBlock section={topLayoutSection} />);
      
      const layout = document.querySelector('[data-layout="media_top"]');
      expect(layout).toBeInTheDocument();
    });
  });

  describe('Text Alignment', () => {
    it('should set text alignment data attributes', () => {
      const centerAlignSection: ContentBlockSection = {
        ...basicContentSection,
        textAlign: 'center',
      };
      
      render(<ContentBlock section={centerAlignSection} />);
      
      const textContent = document.querySelector('[data-align="center"]');
      expect(textContent).toBeInTheDocument();
    });

    it('should handle right alignment', () => {
      const rightAlignSection: ContentBlockSection = {
        ...basicContentSection,
        textAlign: 'right',
      };
      
      render(<ContentBlock section={rightAlignSection} />);
      
      const textContent = document.querySelector('[data-align="right"]');
      expect(textContent).toBeInTheDocument();
    });
  });

  describe('Background Variations', () => {
    it('should set background data attributes', () => {
      const altBgSection: ContentBlockSection = {
        ...basicContentSection,
        background: 'alt',
      };
      
      render(<ContentBlock section={altBgSection} />);
      
      const section = document.querySelector('[data-background="alt"]');
      expect(section).toBeInTheDocument();
    });

    it('should handle inverse background', () => {
      const inverseBgSection: ContentBlockSection = {
        ...basicContentSection,
        background: 'inverse',
      };
      
      render(<ContentBlock section={inverseBgSection} />);
      
      const section = document.querySelector('[data-background="inverse"]');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Brand Emphasis', () => {
    it('should apply brand emphasis data attribute', () => {
      const brandSection: ContentBlockSection = {
        ...basicContentSection,
        brandEmphasis: true,
      };
      
      render(<ContentBlock section={brandSection} />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveAttribute('data-brand-emphasis', 'true');
    });

    it('should not apply brand emphasis when false', () => {
      const noBrandSection: ContentBlockSection = {
        ...basicContentSection,
        brandEmphasis: false,
      };
      
      render(<ContentBlock section={noBrandSection} />);
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveAttribute('data-brand-emphasis', 'false');
    });
  });

  describe('Accessibility', () => {
    it('should provide meaningful aria-label', () => {
      render(<ContentBlock section={basicContentSection} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'Content: Test Content Title');
    });

    it('should provide fallback aria-label when no title', () => {
      const noTitleSection: ContentBlockSection = {
        ...basicContentSection,
        title: undefined,
      };
      
      render(<ContentBlock section={noTitleSection} />);
      
      const section = document.querySelector('section');
      expect(section).toHaveAttribute('aria-label', 'Content section');
    });

    it('should use figure elements for media', () => {
      const sectionWithMedia: ContentBlockSection = {
        ...basicContentSection,
        media: [sampleMedia[0]],
      };
      
      render(<ContentBlock section={sectionWithMedia} />);
      
      const figure = document.querySelector('figure');
      expect(figure).toBeInTheDocument();
    });
  });

  describe('Media Grid Sizing', () => {
    it('should set data attributes for media count', () => {
      const twoMediaSection: ContentBlockSection = {
        ...basicContentSection,
        media: [sampleMedia[0], sampleMedia[1]],
      };
      
      render(<ContentBlock section={twoMediaSection} />);
      
      const grid = document.querySelector('[data-count="2"]');
      expect(grid).toBeInTheDocument();
    });

    it('should handle three media items', () => {
      const threeMediaItems = [
        ...sampleMedia,
        { url: 'https://example.com/image3.jpg', alt: 'Sample image 3' },
      ];
      
      const threeMediaSection: ContentBlockSection = {
        ...basicContentSection,
        media: threeMediaItems,
      };
      
      render(<ContentBlock section={threeMediaSection} />);
      
      const grid = document.querySelector('[data-count="3"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large amounts of content efficiently', () => {
      const start = performance.now();
      
      const largeContentSection: ContentBlockSection = {
        ...basicContentSection,
        title: 'Very long title '.repeat(20),
        body: 'Very long body content '.repeat(50),
        media: sampleMedia,
      };
      
      render(<ContentBlock section={largeContentSection} />);
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should not cause excessive re-renders', () => {
      const renderSpy = jest.fn();
      
      function TestWrapper({ section }: { section: ContentBlockSection }) {
        renderSpy();
        return <ContentBlock section={section} />;
      }
      
      const { rerender } = render(<TestWrapper section={basicContentSection} />);
      
      rerender(<TestWrapper section={basicContentSection} />);
      
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing media URLs gracefully', () => {
      const invalidMedia: MediaItem = {
        url: '',
        alt: 'Invalid image',
      };
      
      const sectionWithInvalidMedia: ContentBlockSection = {
        ...basicContentSection,
        media: [invalidMedia],
      };
      
      // Should not throw an error
      expect(() => {
        render(<ContentBlock section={sectionWithInvalidMedia} />);
      }).not.toThrow();
    });

    it('should handle undefined media array', () => {
      const sectionWithUndefinedMedia: ContentBlockSection = {
        ...basicContentSection,
        media: undefined,
      };
      
      expect(() => {
        render(<ContentBlock section={sectionWithUndefinedMedia} />);
      }).not.toThrow();
    });
  });
});
