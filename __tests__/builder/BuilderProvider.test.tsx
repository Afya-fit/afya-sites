import React from 'react';
import { render } from '@testing-library/react';
import BuilderProvider, { useBuilder } from '../../src/builder/context/BuilderProvider';

function ReadCtx() {
  const { slug, setSlug, save } = useBuilder();
  React.useEffect(() => {
    setSlug('demo');
    save();
  }, [setSlug, save]);
  return <div data-slug={slug || ''} />;
}

describe('BuilderProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists slug+draft to localStorage on save', () => {
    render(
      <BuilderProvider businessId={'biz'}>
        <ReadCtx />
      </BuilderProvider>
    );
    const raw = localStorage.getItem('sb:biz');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(String(raw));
    expect(parsed.slug).toBe('demo');
  });
});


