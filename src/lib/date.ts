import type { YearMonth } from '../types/content';

const YEAR_MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;

export interface ParsedYearMonth {
  year: number;
  /** 0-based month index, matching `Date#getMonth()`. */
  month: number;
}

export function parseYearMonth(value: YearMonth | null | undefined): ParsedYearMonth | null {
  if (!value) return null;
  const match = YEAR_MONTH.exec(value.trim());
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1 };
}

export function formatYearMonth(value: YearMonth | null | undefined, locale?: string): string | null {
  const parsed = parseYearMonth(value);
  if (!parsed) return null;
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(parsed.year, parsed.month, 1)),
  );
}

/** "Apr 2023 — Present", "Jul 2021 — Mar 2023", or `null` when the start date is missing/invalid. */
export function formatDateRange(
  start: YearMonth | null | undefined,
  end: YearMonth | null | undefined,
  locale?: string,
  presentLabel = 'Present',
): string | null {
  const from = formatYearMonth(start, locale);
  if (!from) return null;
  const to = end ? formatYearMonth(end, locale) : presentLabel;
  return `${from} — ${to ?? presentLabel}`;
}

/** Whole months between two year-months, counting both the start and end month. */
export function monthsBetween(start: ParsedYearMonth, end: ParsedYearMonth): number {
  return Math.max(0, (end.year - start.year) * 12 + (end.month - start.month) + 1);
}

function currentYearMonth(now: Date): ParsedYearMonth {
  return { year: now.getFullYear(), month: now.getMonth() };
}

/** "1 yr 9 mos", "8 mos". Returns `null` for invalid input. */
export function formatDuration(
  start: YearMonth | null | undefined,
  end: YearMonth | null | undefined,
  now: Date = new Date(),
): string | null {
  const from = parseYearMonth(start);
  if (!from) return null;
  const to = parseYearMonth(end) ?? currentYearMonth(now);
  const total = monthsBetween(from, to);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years === 1 ? '' : 's'}`);
  if (months > 0) parts.push(`${months} mo${months === 1 ? '' : 's'}`);
  return parts.length ? parts.join(' ') : '1 mo';
}

/** Completed years since a year-month, never negative. */
export function yearsSince(start: YearMonth | null | undefined, now: Date = new Date()): number | null {
  const from = parseYearMonth(start);
  if (!from) return null;
  return Math.floor((monthsBetween(from, currentYearMonth(now)) - 1) / 12);
}
