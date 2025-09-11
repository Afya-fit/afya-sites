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
});


