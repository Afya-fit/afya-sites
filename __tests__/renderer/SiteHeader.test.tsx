import React from 'react';
import { render } from '@testing-library/react';
import SiteHeader from '../../src/renderer/components/SiteHeader';

describe('SiteHeader', () => {
  it('renders business name and optional logo', () => {
    const { asFragment, getByText } = render(<SiteHeader businessName='Demo Gym' logoUrl='https://example.com/logo.png' />);
    expect(getByText('Demo Gym')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});


