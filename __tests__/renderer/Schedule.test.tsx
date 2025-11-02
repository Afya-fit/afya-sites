import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Schedule from '../../src/renderer/components/sections/Schedule';

describe('Schedule', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-09-13T10:00:00Z'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  const base = {
    type: 'schedule',
    title: 'Schedule',
    viewMode: 'stacked',
    windowDays: 3,
  } as any;

  const make = (overrides: Partial<typeof base> = {}, items: any[] = []) => {
    const section = { ...base, ...overrides } as any;
    const now = new Date();
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString();
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0).toISOString();
    const data = {
      platform_data: {
        schedule: items.length ? items : [
          { id: 'a', title: 'Class A', starts_at: d0 },
          { id: 'b', title: 'Class B', starts_at: d1 },
        ],
      },
    };
    return { section, data };
  };

  it('renders chips for window and shows sessions', () => {
    const { section, data } = make({ windowDays: 2 });
    const { getByText, asFragment } = render(<Schedule section={section} data={data} />);
    expect(getByText('Schedule')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('single_day view filters to the selected day', () => {
    const { section, data } = make({ viewMode: 'single_day', windowDays: 2 });
    const { getAllByRole } = render(<Schedule section={section} data={data} />);
    const chips = getAllByRole('button');
    fireEvent.click(chips[1]);
  });

  it('excludes items outside windowDays', () => {
    const now = new Date();
    const outOfWindow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 12, 0).toISOString();
    const { section, data } = make({ windowDays: 2 }, [
      { id: 'in', title: 'In', starts_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString() },
      { id: 'out', title: 'Out', starts_at: outOfWindow },
    ]);
    const { queryByText, getByText } = render(<Schedule section={section} data={data} />);
    expect(getByText('In')).toBeInTheDocument();
    expect(queryByText('Out')).toBeNull();
  });

  it('shows Fully booked when capacity==booked; otherwise defaults to available when missing', () => {
    const now = new Date();
    const items = [
      { id: 'f', title: 'Full', starts_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(), capacity: 10, booked: 10 },
      { id: 'u', title: 'Unknown', starts_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString() },
    ];
    const { getByText, getAllByText } = render(<Schedule section={base as any} data={{ platform_data: { schedule: items } }} />);
    expect(getByText('Full')).toBeInTheDocument();
    expect(getByText('Unknown')).toBeInTheDocument();
    expect(getByText('Fully booked')).toBeInTheDocument();
    expect(getAllByText('Spots available').length).toBeGreaterThan(0);
  });

  it('sorts items within a day by start time', () => {
    const now = new Date();
    const items = [
      { id: 'b', title: 'B', starts_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0).toISOString() },
      { id: 'a', title: 'A', starts_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString() },
    ];
    const { container } = render(<Schedule section={base as any} data={{ platform_data: { schedule: items } }} />);
    const labels = Array.from(container.querySelectorAll('li span:nth-child(2)')).map(n => n.textContent);
    expect(labels).toEqual(['A', 'B']);
  });
});


