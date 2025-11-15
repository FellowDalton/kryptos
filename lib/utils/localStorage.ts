/**
 * localStorage utilities for Praylude
 * Handles reading and writing meditation session data and stats
 */

export interface StoredSession {
  id: string;
  completedAt: string; // ISO timestamp
  duration: number; // seconds
  sessionName: string; // e.g., "Standard Meditation"
  notes?: string;
}

export interface StoredStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  lastSessionDate: string;
}

const defaultStats: StoredStats = {
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  lastSessionDate: '',
};

/**
 * Get all completed sessions from localStorage
 */
export function getCompletedSessions(): StoredSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const sessions = localStorage.getItem('praylude_sessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error reading sessions from localStorage:', error);
    return [];
  }
}

/**
 * Get user stats from localStorage
 */
export function getStats(): StoredStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const stats = localStorage.getItem('praylude_stats');
    return stats ? JSON.parse(stats) : defaultStats;
  } catch (error) {
    console.error('Error reading stats from localStorage:', error);
    return defaultStats;
  }
}

/**
 * Save a completed session to localStorage
 */
export function saveSession(session: StoredSession): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getCompletedSessions();
    sessions.push(session);
    localStorage.setItem('praylude_sessions', JSON.stringify(sessions));

    // Update stats
    updateStats(session);
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
}

/**
 * Update stats after a session completion
 */
function updateStats(session: StoredSession): void {
  const stats = getStats();
  const sessionDate = new Date(session.completedAt).toDateString();

  stats.totalSessions += 1;
  stats.totalMinutes += Math.round(session.duration / 60);

  // Calculate streak
  const sessions = getCompletedSessions();
  stats.currentStreak = calculateStreak(sessions);
  stats.lastSessionDate = sessionDate;

  localStorage.setItem('praylude_stats', JSON.stringify(stats));
}

/**
 * Calculate consecutive days with sessions
 */
export function calculateStreak(sessions: StoredSession[]): number {
  if (sessions.length === 0) return 0;

  // Sort sessions by date (newest first)
  const sorted = [...sessions].sort((a, b) =>
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  // Get unique dates (just the date part, not time)
  const uniqueDates = Array.from(
    new Set(sorted.map(s => new Date(s.completedAt).toDateString()))
  );

  // Check if the most recent session was today or yesterday
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0; // Streak broken
  }

  // Count consecutive days
  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = uniqueDates[i];
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (sessionDate === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get the most popular time of day for meditation
 */
export function getFavoriteTimeOfDay(sessions: StoredSession[]): string {
  if (sessions.length === 0) return 'N/A';

  const timeSlots = {
    morning: 0,   // 5am - 11am
    afternoon: 0, // 11am - 5pm
    evening: 0,   // 5pm - 9pm
    night: 0,     // 9pm - 5am
  };

  sessions.forEach(session => {
    const hour = new Date(session.completedAt).getHours();

    if (hour >= 5 && hour < 11) {
      timeSlots.morning++;
    } else if (hour >= 11 && hour < 17) {
      timeSlots.afternoon++;
    } else if (hour >= 17 && hour < 21) {
      timeSlots.evening++;
    } else {
      timeSlots.night++;
    }
  });

  const max = Math.max(...Object.values(timeSlots));
  const favorite = Object.entries(timeSlots).find(([_, count]) => count === max);

  return favorite ? favorite[0].charAt(0).toUpperCase() + favorite[0].slice(1) : 'N/A';
}

/**
 * Format total meditation time in hours and minutes
 */
export function formatTotalTime(totalMinutes: number): string {
  if (totalMinutes === 0) return '0 minutes';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
}
