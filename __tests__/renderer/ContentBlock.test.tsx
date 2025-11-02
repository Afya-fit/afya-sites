import React from 'react';
import { render } from '@testing-library/react';
import ContentBlock from '../../src/renderer/components/sections/content-block';

describe('ContentBlock', () => {
  it('renders title, body and media', () => {
    const { asFragment, getByText } = render(
      <ContentBlock
        section={{
          type: 'content_block',
          title: 'Small-group training',
          body: 'Build strength and community',
          layout: 'media_top',
          media: [{ url: 'https://example.com/img.jpg', alt: 'Alt' }],
        }}
      />
    );
    expect(getByText('Small-group training')).toBeInTheDocument();
    expect(getByText('Build strength and community')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});


