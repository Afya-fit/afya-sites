import React from 'react';
import { render } from '@testing-library/react';
import MediaFrame from '../../src/renderer/utils/MediaFrame';

describe('MediaFrame', () => {
  it('applies aspect ratio and fit styles', () => {
    const { asFragment } = render(<MediaFrame src='https://picsum.photos/seed/test/1600/900' ratio='16x9' fit='cover' />);
    expect(asFragment()).toMatchSnapshot();
  });
});


