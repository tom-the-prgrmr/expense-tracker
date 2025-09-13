/**
 * Utility functions for UTC time conversion and handling
 * These functions ensure all API calls use UTC time consistently
 */

/**
 * Convert a local date to UTC epoch seconds for start of day
 */
export function localDateToUtcEpochSeconds(date: Date): number {
  // Convert local date to start of day in UTC+0, then to epoch seconds
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const startOfDay = new Date(
    Date.UTC(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate())
  );
  return Math.floor(startOfDay.getTime() / 1000);
}

/**
 * Convert a local date to UTC epoch seconds for start of day (alias for consistency)
 */
export const localDateToUtcStartOfDayEpochSeconds = localDateToUtcEpochSeconds;

/**
 * Convert a local date to UTC epoch seconds for end of day
 */
export function localDateToUtcEndOfDayEpochSeconds(date: Date): number {
  // Convert local date to end of day in UTC+0, then to epoch seconds
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const endOfDay = new Date(
    Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      23,
      59,
      59,
      999
    )
  );
  return Math.floor(endOfDay.getTime() / 1000);
}

/**
 * Convert any Date object to UTC epoch seconds
 */
export function dateToUtcEpochSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Convert current time to UTC epoch seconds
 */
export function nowToUtcEpochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert a specific time (hours, minutes, seconds) of a date to UTC epoch seconds
 */
export function dateWithTimeToUtcEpochSeconds(
  date: Date,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): number {
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const dateWithTime = new Date(
    Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      hours,
      minutes,
      seconds
    )
  );
  return Math.floor(dateWithTime.getTime() / 1000);
}

/**
 * Convert epoch seconds to UTC Date
 */
export function epochSecondsToUtcDate(epochSeconds: number): Date {
  return new Date(epochSeconds * 1000);
}

/**
 * Convert epoch seconds to UTC ISO date string (YYYY-MM-DD)
 */
export function epochSecondsToUtcIsoDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toISOString().slice(0, 10);
}

/**
 * Convert local date to UTC ISO date string (YYYY-MM-DD)
 */
export function localDateToUtcIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Convert UTC ISO date string to epoch seconds
 */
export function utcIsoDateToEpochSeconds(isoDate: string): number {
  return Math.floor(new Date(isoDate + 'T00:00:00.000Z').getTime() / 1000);
}

/**
 * Get current UTC epoch seconds
 */
export function getCurrentUtcEpochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Get today's date range in UTC epoch seconds
 */
export function getTodayUtcEpochRange(): { start: number; end: number } {
  const today = new Date();
  return {
    start: localDateToUtcStartOfDayEpochSeconds(today),
    end: localDateToUtcEndOfDayEpochSeconds(today),
  };
}

/**
 * Get date range for a specific date in UTC epoch seconds
 */
export function getDateUtcEpochRange(date: Date): {
  start: number;
  end: number;
} {
  return {
    start: localDateToUtcStartOfDayEpochSeconds(date),
    end: localDateToUtcEndOfDayEpochSeconds(date),
  };
}

/**
 * Convert date range to UTC epoch seconds for API calls
 */
export function dateRangeToUtcEpochRange(
  startDate: Date,
  endDate: Date
): { start: number; end: number } {
  return {
    start: localDateToUtcStartOfDayEpochSeconds(startDate),
    end: localDateToUtcEndOfDayEpochSeconds(endDate),
  };
}

/**
 * Convert ISO date range to UTC epoch seconds for API calls
 */
export function isoDateRangeToUtcEpochRange(
  startIsoDate: string,
  endIsoDate: string
): { start: number; end: number } {
  return {
    start: utcIsoDateToEpochSeconds(startIsoDate),
    end: utcIsoDateToEpochSeconds(endIsoDate),
  };
}

/**
 * Get start of month in UTC epoch seconds
 */
export function getStartOfMonthUtcEpochSeconds(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return localDateToUtcStartOfDayEpochSeconds(firstDay);
}

/**
 * Get end of month in UTC epoch seconds
 */
export function getEndOfMonthUtcEpochSeconds(date: Date): number {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return localDateToUtcEndOfDayEpochSeconds(lastDay);
}

/**
 * Get start of week (Monday) in UTC epoch seconds
 */
export function getStartOfWeekUtcEpochSeconds(date: Date): number {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  return localDateToUtcStartOfDayEpochSeconds(monday);
}

/**
 * Get end of week (Sunday) in UTC epoch seconds
 */
export function getEndOfWeekUtcEpochSeconds(date: Date): number {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
  const sunday = new Date(date.setDate(diff));
  return localDateToUtcEndOfDayEpochSeconds(sunday);
}

/**
 * Add days to a UTC epoch seconds timestamp
 */
export function addDaysToUtcEpochSeconds(
  epochSeconds: number,
  days: number
): number {
  return epochSeconds + days * 24 * 60 * 60;
}

/**
 * Add hours to a UTC epoch seconds timestamp
 */
export function addHoursToUtcEpochSeconds(
  epochSeconds: number,
  hours: number
): number {
  return epochSeconds + hours * 60 * 60;
}

/**
 * Add minutes to a UTC epoch seconds timestamp
 */
export function addMinutesToUtcEpochSeconds(
  epochSeconds: number,
  minutes: number
): number {
  return epochSeconds + minutes * 60;
}

/**
 * Get difference in days between two UTC epoch seconds timestamps
 */
export function getDaysDifferenceUtcEpochSeconds(
  startEpochSeconds: number,
  endEpochSeconds: number
): number {
  return Math.floor((endEpochSeconds - startEpochSeconds) / (24 * 60 * 60));
}
