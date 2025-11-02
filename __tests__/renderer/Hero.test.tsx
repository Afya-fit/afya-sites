import React from 'react';
import { render } from '@testing-library/react';
import Hero from '../../src/renderer/components/sections/Hero';

describe('Hero', () => {
  it('renders title and subtitle', () => {
    const { asFragment, getByText } = render(
      <Hero section={{ type: 'hero', title: 'Welcome', subtitle: 'Sub', align: 'center', valign: 'center' }} />
    );
    expect(getByText('Welcome')).toBeInTheDocument();
    expect(getByText('Sub')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('applies brand text color when textColorMode=brand', () => {
    const { asFragment, getByText } = render(
      <Hero section={{ type: 'hero', title: 'Brand Title', subtitle: 'Neutral sub', textColorMode: 'brand' }} />
    );
    expect(getByText('Brand Title')).toBeInTheDocument();
    expect(getByText('Neutral sub')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('defaults to neutral text color when textColorMode is neutral/undefined', () => {
    const { asFragment, getByText } = render(
      <Hero section={{ type: 'hero', title: 'Neutral Title' }} />
    )
    expect(getByText('Neutral Title')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
});


