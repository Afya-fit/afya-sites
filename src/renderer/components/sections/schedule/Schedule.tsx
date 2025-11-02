/**
 * Schedule Section Component - One-Path Styling Framework
 * 
 * Minimal implementation that displays schedule information with day/time slots.
 * Refactored to use SectionBox + CSS modules instead of inline styles.
 * 
 * @version 1.0 - One-Path Styling Framework
 */

import React, { useMemo, useState } from 'react';
import type { ScheduleSection } from '../../../types';
import { SectionBox } from '../../SectionBox';
import { varsForSchedule } from '../../../utils/mapSectionVars';
import { TextWithLineBreaks } from '../../../utils/textRendering';

export interface ScheduleProps {
  section: ScheduleSection;
  data?: any; // Platform data containing schedule items
}

type ScheduleItem = {
  id: string;
  title: string;
  starts_at: string; // ISO date string
  capacity?: number;
  booked?: number;
};

/**
 * Utility functions for date formatting
 */
function formatDay(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && 
         a.getMonth() === b.getMonth() && 
         a.getDate() === b.getDate();
}

/**
 * Single Schedule Item Component
 */
function ScheduleItemComponent({ item }: { item: ScheduleItem }) {
  const startDate = new Date(item.starts_at);
  const hasCapacity = typeof item.capacity === 'number' && typeof item.booked === 'number';

  return (
    <li className="sb-schedule-item">
      <div className="sb-schedule-item-content">
        <h4 className="sb-schedule-item-title">
          {item.title}
        </h4>
        <p className="sb-schedule-item-time">
          {formatTime(startDate)}
        </p>
      </div>
      
      {hasCapacity && (
        <div className="sb-schedule-item-capacity">
          {item.booked}/{item.capacity}
        </div>
      )}
    </li>
  );
}

/**
 * Day Section Component
 */
function DaySection({ 
  date, 
  items 
}: { 
  date: Date; 
  items: ScheduleItem[]; 
}) {
  const dayOfWeek = formatDay(date);
  const dateString = formatDate(date);
  const isToday = typeof Date !== 'undefined' ? isSameDay(date, new Date()) : false;

  return (
    <div className="sb-schedule-day-section">
      <h3 className="sb-schedule-day-header">
        {dayOfWeek} {dateString}
        {isToday && ' (Today)'}
      </h3>
      
      {items.length > 0 ? (
        <ul className="sb-schedule-list">
          {items.map((item) => (
            <ScheduleItemComponent key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <div className="sb-schedule-empty-day">
          No appointments scheduled
        </div>
      )}
    </div>
  );
}

/**
 * Schedule Component
 */
export function Schedule({ section, data }: ScheduleProps) {
  const { title, windowDays = 7 } = section;
  
  // State management - Single day view only
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Extract schedule data
  const schedule: ScheduleItem[] = (data?.platform_data?.schedule || []) as ScheduleItem[];

  // Generate days window (SSR-safe) - Fixed window from today
  const days = useMemo(() => {
    // Always start from today, regardless of selectedDate
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dayCount = Math.max(1, Math.min(7, windowDays)); // Support 3-day and 7-day windows
    
    return Array.from({ length: dayCount }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [windowDays]); // Only depend on windowDays, not selectedDate

  // Initialize selectedDate to today (or first day with events if available)
  React.useEffect(() => {
    if (selectedDate === null && days.length > 0) {
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Check if today is in our window
      const todayInWindow = days.find(day => isSameDay(day, todayNormalized));
      
      if (todayInWindow) {
        // Use today if it's in the window
        setSelectedDate(todayInWindow);
      } else {
        // Fallback to first day in window
        setSelectedDate(days[0]);
      }
    }
  }, [days, selectedDate]);

  // Group schedule items by day
  const scheduleByDay = useMemo(() => {
    const grouped = new Map<string, ScheduleItem[]>();
    
    // Initialize all days with empty arrays
    days.forEach(day => {
      const key = day.toISOString().split('T')[0];
      grouped.set(key, []);
    });
    
    // Group schedule items by day
    schedule.forEach(item => {
      const itemDate = new Date(item.starts_at);
      const key = itemDate.toISOString().split('T')[0];
      
      if (grouped.has(key)) {
        grouped.get(key)!.push(item);
      }
    });
    
    // Sort items within each day by time
    grouped.forEach(items => {
      items.sort((a, b) => 
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      );
    });
    
    return grouped;
  }, [schedule, days]);

  // Helper function to check if a date is within the allowed window
  const isDateInWindow = (date: Date) => {
    return days.some(day => isSameDay(day, date));
  };

  // Safe date selection - only allow dates within the fixed window
  const handleDateSelection = (date: Date) => {
    if (isDateInWindow(date)) {
      setSelectedDate(date);
    }
  };

  // Generate section variables
  const sectionVars = varsForSchedule(section);

  return (
    <SectionBox
      id={section.id}
      slug={section.slug}
      type="schedule"
      vars={sectionVars}
      className="sb-schedule-section"
      aria-label={title ? `Schedule: ${title}` : 'Schedule'}
    >
      <div className="sb-schedule-container">
        {/* Section Title */}
        {title && (
          <TextWithLineBreaks
            as="h2"
            className="sb-schedule-title"
          >
            {title}
          </TextWithLineBreaks>
        )}

        {/* Day Selector - Simplified horizontal list */}
        <div className="sb-schedule-day-selector">
          {days.map((day) => {
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isToday = typeof Date !== 'undefined' ? isSameDay(day, new Date()) : false;
            
            return (
              <button
                key={day.toISOString()}
                className={`sb-schedule-day-button ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => handleDateSelection(day)}
                aria-pressed={isSelected}
              >
                <div>{formatDay(day)}</div>
                <div>{day.getDate()}</div>
              </button>
            );
          })}
        </div>

        {/* Schedule List - Single day only */}
        {scheduleByDay.size > 0 ? (
          selectedDate ? (() => {
            const key = selectedDate.toISOString().split('T')[0];
            const items = scheduleByDay.get(key) || [];
            
            return (
              <DaySection
                date={selectedDate}
                items={items}
              />
            );
          })() : <p className="sb-schedule-loading">Loading schedule...</p>
        ) : (
          /* Empty State */
          <div className="sb-schedule-empty-state">
            <p>No schedule information available.</p>
          </div>
        )}
      </div>
    </SectionBox>
  );
}

// Mark as using the new framework
export const usesFramework = true;

export default Schedule;
