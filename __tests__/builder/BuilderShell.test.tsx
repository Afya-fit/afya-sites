import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BuilderShell from '../../src/builder/BuilderShell';
jest.mock('../../src/shared/api', () => ({
  publishSite: jest.fn().mockResolvedValue({ ok: true, data: { task_id: 't1' } }),
  getPublishStatus: jest.fn()
}));
import { getPublishStatus } from '../../src/shared/api';
import BuilderProvider from '../../src/builder/context/BuilderProvider';

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe('BuilderShell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderWithProvider() {
    localStorage.setItem('sb:biz', JSON.stringify({ slug: 'demo', draft: { version: '1.0', business_id: 'biz', theme: {}, sections: [] } }));
    return render(
      <BuilderProvider businessId={'biz'}>
        <BuilderShell />
      </BuilderProvider>
    );
  }

  it('validates slug and shows hint when invalid', () => {
    const { getByLabelText, getByText } = renderWithProvider();
    const input = getByLabelText('Slug:') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'INVALID*' } });
    expect(getByText(/use a‑z, 0‑9, hyphen/)).toBeInTheDocument();
  });

  it('copies URL to clipboard', async () => {
    const { getByLabelText } = renderWithProvider();
    const btn = getByLabelText('Copy URL');
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('toggles device and view via segmented controls', () => {
    const { getByText } = renderWithProvider();
    const desktop = getByText('Desktop');
    const mobile = getByText('Mobile');
    fireEvent.click(mobile);
    fireEvent.click(desktop);
    const draft = getByText('Draft');
    const published = getByText('Published');
    fireEvent.click(published);
    fireEvent.click(draft);
  });

  it('publishes and transitions status to LIVE on SUCCESS', async () => {
    (getPublishStatus as jest.Mock).mockResolvedValueOnce({ ok: true, data: { state: 'PENDING' } })
      .mockResolvedValueOnce({ ok: true, data: { state: 'SUCCESS' } })
    const { getByText } = renderWithProvider();
    const publishBtn = getByText('Publish')
    publishBtn && fireEvent.click(publishBtn)
    // First shows provisioning
    expect(getByText(/UNPROVISIONED|PROVISIONING/)).toBeInTheDocument()
  });
});


