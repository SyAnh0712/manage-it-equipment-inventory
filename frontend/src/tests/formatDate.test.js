import { describe, it, expect } from 'vitest';
import { formatDate, formatDateOnly } from '../formatDate';

describe('formatDate utilities', () => {
  describe('formatDate', () => {
    it('should return "-" if dateString is empty or null', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
      expect(formatDate("")).toBe('-');
    });

    it('should format valid date strings with date and time', () => {
      // By using a local ISO string (no timezone offset Z), new Date parses it as local time.
      const result = formatDate('2026-06-15T05:26:00');
      
      // The output will be in en-US locale format
      expect(result).toContain('Jun 15, 2026');
      
      // Check for '05:26' (or '5:26') in the time part
      expect(result).toMatch(/(0?5:26)/);
    });
  });

  describe('formatDateOnly', () => {
    it('should return "-" if dateString is empty or null', () => {
      expect(formatDateOnly(null)).toBe('-');
      expect(formatDateOnly(undefined)).toBe('-');
      expect(formatDateOnly("")).toBe('-');
    });

    it('should format valid date strings with date only', () => {
      const result = formatDateOnly('2026-06-15T05:26:00');
      expect(result).toBe('Jun 15, 2026');
    });
  });
});
