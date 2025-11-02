/**
 * Phase 3 Sections Tests - BusinessData, SpecialOffers, LinksPage, Schedule
 * 
 * Basic tests for the refactored Phase 3 components using the One-Path Styling Framework.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BusinessData } from '../../../src/renderer/components/sections/business-data/BusinessData';
import { SpecialOffers } from '../../../src/renderer/components/sections/special-offers/SpecialOffers';
import { LinksPage } from '../../../src/renderer/components/sections/links-page/LinksPage';
import { Schedule } from '../../../src/renderer/components/sections/schedule/Schedule';

import type { 
  BusinessDataSection, 
  SpecialOffersSection, 
  LinksPageSection, 
  ScheduleSection,
  SpecialOffer,
  LinkItem
} from '../../../src/renderer/types';

describe('Phase 3 Sections - Framework Integration', () => {
  describe('BusinessData Component', () => {
    const basicSection: BusinessDataSection = {
      id: 'business-1',
      type: 'business_data',
      title: 'Business Information',
      fields: ['business_info', 'programs'],
    };

    const mockData = {
      platform_data: {
        business_info: {
          name: 'Test Business',
          phone: '+1-555-123-4567',
          email: 'test@business.com',
          address: '123 Main St, City, State',
        },
        programs: [
          { id: 'p1', name: 'Program 1' },
          { id: 'p2', name: 'Program 2' },
        ],
      },
    };

    it('should render using SectionBox wrapper', () => {
      render(<BusinessData section={basicSection} data={mockData} />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-sb-section', 'business_data');
    });

    it('should export framework compliance flag', () => {
      const BusinessDataModule = require('../../../src/renderer/components/sections/business-data/BusinessData');
      expect(BusinessDataModule.usesFramework).toBe(true);
    });

    it('should render business information', () => {
      render(<BusinessData section={basicSection} data={mockData} />);
      
      expect(screen.getAllByText('Business Information')).toHaveLength(2); // Title and section header
      expect(screen.getByText('Test Business')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
    });

    it('should handle empty data gracefully', () => {
      render(<BusinessData section={basicSection} />);
      
      expect(screen.getByText('No business data available to display.')).toBeInTheDocument();
    });
  });

  describe('SpecialOffers Component', () => {
    const sampleOffers: SpecialOffer[] = [
      {
        id: 'offer-1',
        title: 'Summer Special',
        description: 'Get 20% off all services',
        price: '$99',
        ctaLabel: 'Book Now',
        ctaHref: 'https://example.com/book',
      },
      {
        id: 'offer-2',
        title: 'New Member Deal',
        description: 'First session free',
        price: 'Free',
        ctaLabel: 'Sign Up',
        ctaHref: 'https://example.com/signup',
      },
    ];

    const basicSection: SpecialOffersSection = {
      id: 'offers-1',
      type: 'special_offers',
      title: 'Special Offers',
      offers: sampleOffers,
    };

    it('should render using SectionBox wrapper', () => {
      render(<SpecialOffers section={basicSection} />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-sb-section', 'special_offers');
    });

    it('should export framework compliance flag', () => {
      const SpecialOffersModule = require('../../../src/renderer/components/sections/special-offers/SpecialOffers');
      expect(SpecialOffersModule.usesFramework).toBe(true);
    });

    it('should render offers', () => {
      render(<SpecialOffers section={basicSection} />);
      
      expect(screen.getByText('Special Offers')).toBeInTheDocument();
      expect(screen.getByText('Summer Special')).toBeInTheDocument();
      expect(screen.getByText('Get 20% off all services')).toBeInTheDocument();
      expect(screen.getByText('$99')).toBeInTheDocument();
    });

    it('should render CTA buttons', () => {
      render(<SpecialOffers section={basicSection} />);
      
      const bookButton = screen.getByText('Book Now');
      const signupButton = screen.getByText('Sign Up');
      
      expect(bookButton).toBeInTheDocument();
      expect(bookButton).toHaveAttribute('href', 'https://example.com/book');
      expect(signupButton).toBeInTheDocument();
      expect(signupButton).toHaveAttribute('href', 'https://example.com/signup');
    });

    it('should handle empty offers gracefully', () => {
      const emptySection: SpecialOffersSection = {
        ...basicSection,
        offers: [],
      };
      
      render(<SpecialOffers section={emptySection} />);
      
      expect(screen.getByText('No special offers available at this time.')).toBeInTheDocument();
    });
  });

  describe('LinksPage Component', () => {
    const sampleLinks: LinkItem[] = [
      {
        id: 'link-1',
        label: 'Website',
        href: 'https://example.com',
      },
      {
        id: 'link-2',
        label: 'Instagram',
        href: 'https://instagram.com/example',
      },
      {
        id: 'link-3',
        label: 'Contact Us',
        href: 'mailto:contact@example.com',
      },
    ];

    const basicSection: LinksPageSection = {
      id: 'links-1',
      type: 'links_page',
      title: 'Quick Links',
      links: sampleLinks,
    };

    it('should render using SectionBox wrapper', () => {
      render(<LinksPage section={basicSection} />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-sb-section', 'links_page');
    });

    it('should export framework compliance flag', () => {
      const LinksPageModule = require('../../../src/renderer/components/sections/links-page/LinksPage');
      expect(LinksPageModule.usesFramework).toBe(true);
    });

    it('should render links', () => {
      render(<LinksPage section={basicSection} />);
      
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('should apply correct link attributes', () => {
      render(<LinksPage section={basicSection} />);
      
      const websiteLink = screen.getByText('Website');
      expect(websiteLink).toHaveAttribute('href', 'https://example.com');
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should handle empty links gracefully', () => {
      const emptySection: LinksPageSection = {
        ...basicSection,
        links: [],
      };
      
      render(<LinksPage section={emptySection} />);
      
      expect(screen.getByText('No links available to display.')).toBeInTheDocument();
    });
  });

  describe('Schedule Component', () => {
    const basicSection: ScheduleSection = {
      id: 'schedule-1',
      type: 'schedule',
      title: 'Schedule',
      windowDays: 7,
      viewMode: 'stacked',
    };

    const mockScheduleData = {
      platform_data: {
        schedule: [
          {
            id: 'apt-1',
            title: 'Morning Session',
            starts_at: new Date().toISOString(),
            capacity: 10,
            booked: 5,
          },
          {
            id: 'apt-2',
            title: 'Evening Session',
            starts_at: new Date(Date.now() + 3600000).toISOString(), // +1 hour
            capacity: 8,
            booked: 3,
          },
        ],
      },
    };

    it('should render using SectionBox wrapper', () => {
      render(<Schedule section={basicSection} data={mockScheduleData} />);
      
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-sb-section', 'schedule');
    });

    it('should export framework compliance flag', () => {
      const ScheduleModule = require('../../../src/renderer/components/sections/schedule/Schedule');
      expect(ScheduleModule.usesFramework).toBe(true);
    });

    it('should render schedule items', () => {
      render(<Schedule section={basicSection} data={mockScheduleData} />);
      
      expect(screen.getByText('Schedule')).toBeInTheDocument();
      expect(screen.getByText('Morning Session')).toBeInTheDocument();
      expect(screen.getByText('Evening Session')).toBeInTheDocument();
    });

    it('should render view mode toggle', () => {
      render(<Schedule section={basicSection} data={mockScheduleData} />);
      
      expect(screen.getByText('Week View')).toBeInTheDocument();
      expect(screen.getByText('Day View')).toBeInTheDocument();
    });

    it('should handle empty schedule gracefully', () => {
      render(<Schedule section={basicSection} />);
      
      // Should show individual day empty messages, not the global empty state
      expect(screen.getAllByText('No appointments scheduled')).toHaveLength(7); // 7 days
    });
  });

  describe('Framework Compliance', () => {
    it('should apply CSS module classes to all components', () => {
      const sections = [
        { component: BusinessData, section: { id: 'b1', type: 'business_data' as const } },
        { component: SpecialOffers, section: { id: 's1', type: 'special_offers' as const, offers: [] } },
        { component: LinksPage, section: { id: 'l1', type: 'links_page' as const, links: [] } },
        { component: Schedule, section: { id: 'sc1', type: 'schedule' as const } },
      ];

      sections.forEach(({ component: Component, section }) => {
        const { container } = render(<Component section={section} />);
        const sectionElement = container.querySelector('section');
        
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement?.className).toBeTruthy();
      });
    });

    it('should provide meaningful aria-labels', () => {
      const sections = [
        { component: BusinessData, section: { id: 'b1', type: 'business_data' as const, title: 'Business Info' }, label: 'Business Data: Business Info' },
        { component: SpecialOffers, section: { id: 's1', type: 'special_offers' as const, title: 'Offers', offers: [] }, label: 'Special Offers: Offers' },
        { component: LinksPage, section: { id: 'l1', type: 'links_page' as const, title: 'Links', links: [] }, label: 'Links: Links' },
        { component: Schedule, section: { id: 'sc1', type: 'schedule' as const, title: 'Schedule' }, label: 'Schedule: Schedule' },
      ];

      sections.forEach(({ component: Component, section, label }) => {
        const { container } = render(<Component section={section} />);
        const sectionElement = container.querySelector('section');
        
        expect(sectionElement).toHaveAttribute('aria-label', label);
      });
    });
  });
});
