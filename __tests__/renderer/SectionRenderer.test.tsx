import React from 'react';
import { render } from '@testing-library/react';
import SectionRenderer from '../../src/renderer/SectionRenderer';

describe('SectionRenderer', () => {
  it('renders multiple section types', () => {
    const sections: any[] = [
      { type: 'hero', title: 'Welcome' },
      { type: 'content_block', title: 'Block' },
      { type: 'schedule', title: 'Schedule', viewMode: 'stacked', windowDays: 2 },
    ];
    const data = { site_config: { version: '1.0', business_id: 'x', theme: {}, sections }, platform_data: {} } as any;
    const { asFragment } = render(<SectionRenderer sections={sections} data={data} />);
    expect(asFragment()).toMatchSnapshot();
  });
});


