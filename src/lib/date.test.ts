import { describe, expect, it } from 'vitest';
import { formatDateRange, formatDuration, formatYearMonth, parseYearMonth, yearsSince } from './date';

describe('date helpers', () => {
  it('parses YYYY-MM and rejects malformed values', () => {
    expect(parseYearMonth('2023-04')).toEqual({ year: 2023, month: 3 });
    expect(parseYearMonth('2023-13')).toBeNull();
    expect(parseYearMonth('April 2023')).toBeNull();
    expect(parseYearMonth(undefined)).toBeNull();
  });

  it('formats a month and a range, treating a missing end as Present', () => {
    expect(formatYearMonth('2023-04', 'en-US')).toBe('Apr 2023');
    expect(formatDateRange('2021-07', '2023-03', 'en-US')).toBe('Jul 2021 — Mar 2023');
    expect(formatDateRange('2023-04', null, 'en-US')).toBe('Apr 2023 — Present');
    expect(formatDateRange('bad', null)).toBeNull();
  });

  it('computes inclusive durations', () => {
    expect(formatDuration('2021-07', '2023-03')).toBe('1 yr 9 mos');
    expect(formatDuration('2023-01', '2023-01')).toBe('1 mo');
    expect(formatDuration('2022-01', '2023-12')).toBe('2 yrs');
    expect(formatDuration('2026-01', null, new Date(2026, 5, 15))).toBe('6 mos');
  });

  it('computes completed years since a date', () => {
    const now = new Date(2026, 10, 12); // Nov 2026
    expect(yearsSince('2021-07', now)).toBe(5);
    expect(yearsSince('2026-11', now)).toBe(0);
    expect(yearsSince('2021-12', now)).toBe(4);
    expect(yearsSince(undefined, now)).toBeNull();
  });
});
