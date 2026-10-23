/** @jest-environment node */
import { formatDate, readingTime, splitTags } from '../src/lib/site';

describe('site helpers', () => {
  it('estimates reading time from HTML at ~200 wpm, minimum 1 minute', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('<p>short</p>')).toBe(1);
    const words = Array.from({ length: 1000 }, () => 'word').join(' ');
    expect(readingTime(`<h2>T</h2><p>${words}</p>`)).toBe(5);
  });

  it('formats ISO dates in UTC and tolerates missing dates', () => {
    expect(formatDate('2026-10-23T23:30:00Z')).toBe('Oct 23, 2026');
    expect(formatDate(null)).toBe('');
  });

  it('splits comma-separated tags and trims blanks', () => {
    expect(splitTags(' React, Next ,, ')).toEqual(['React', 'Next']);
  });
});
