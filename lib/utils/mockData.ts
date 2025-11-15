/**
 * Mock data utilities for testing localStorage functionality
 * This helps test the profile and history pages with realistic data
 */

import { type StoredSession } from './localStorage';

/**
 * Generate mock meditation sessions for testing
 */
export function generateMockSessions(): StoredSession[] {
  const now = new Date();
  const sessions: StoredSession[] = [];

  // Session today at 7:00 AM
  const today7am = new Date(now);
  today7am.setHours(7, 0, 0, 0);
  sessions.push({
    id: 'session-1',
    completedAt: today7am.toISOString(),
    duration: 1200, // 20 minutes
    sessionName: 'Standard Meditation',
    notes: 'Felt peaceful and centered this morning',
  });

  // Session yesterday at 7:15 AM
  const yesterday7am = new Date(now);
  yesterday7am.setDate(yesterday7am.getDate() - 1);
  yesterday7am.setHours(7, 15, 0, 0);
  sessions.push({
    id: 'session-2',
    completedAt: yesterday7am.toISOString(),
    duration: 1260, // 21 minutes
    sessionName: 'Standard Meditation',
  });

  // Session 2 days ago at 6:45 AM
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(6, 45, 0, 0);
  sessions.push({
    id: 'session-3',
    completedAt: twoDaysAgo.toISOString(),
    duration: 900, // 15 minutes
    sessionName: 'Standard Meditation',
  });

  // Session 3 days ago at 7:30 AM
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(7, 30, 0, 0);
  sessions.push({
    id: 'session-4',
    completedAt: threeDaysAgo.toISOString(),
    duration: 1500, // 25 minutes
    sessionName: 'Custom Session - Deep Prayer',
    notes: 'Focused on gratitude and thanksgiving',
  });

  // Session 5 days ago at 6:00 PM (evening)
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  fiveDaysAgo.setHours(18, 0, 0, 0);
  sessions.push({
    id: 'session-5',
    completedAt: fiveDaysAgo.toISOString(),
    duration: 1080, // 18 minutes
    sessionName: 'Standard Meditation',
  });

  // Session 6 days ago at 7:00 AM
  const sixDaysAgo = new Date(now);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  sixDaysAgo.setHours(7, 0, 0, 0);
  sessions.push({
    id: 'session-6',
    completedAt: sixDaysAgo.toISOString(),
    duration: 1200, // 20 minutes
    sessionName: 'Standard Meditation',
  });

  // Session 7 days ago at 7:15 AM
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(7, 15, 0, 0);
  sessions.push({
    id: 'session-7',
    completedAt: sevenDaysAgo.toISOString(),
    duration: 1320, // 22 minutes
    sessionName: 'Standard Meditation',
  });

  // Session 10 days ago at 9:00 PM (night)
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  tenDaysAgo.setHours(21, 0, 0, 0);
  sessions.push({
    id: 'session-8',
    completedAt: tenDaysAgo.toISOString(),
    duration: 600, // 10 minutes
    sessionName: 'Quick Evening Prayer',
    notes: 'Short session before bed',
  });

  // Session 14 days ago at 1:00 PM (afternoon)
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(13, 0, 0, 0);
  sessions.push({
    id: 'session-9',
    completedAt: fourteenDaysAgo.toISOString(),
    duration: 1800, // 30 minutes
    sessionName: 'Extended Meditation',
    notes: 'Longest session yet - felt the presence of God',
  });

  // Session 20 days ago at 7:00 AM
  const twentyDaysAgo = new Date(now);
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
  twentyDaysAgo.setHours(7, 0, 0, 0);
  sessions.push({
    id: 'session-10',
    completedAt: twentyDaysAgo.toISOString(),
    duration: 1200, // 20 minutes
    sessionName: 'Standard Meditation',
  });

  return sessions;
}

/**
 * Load mock data into localStorage for testing
 */
export function loadMockData(): void {
  if (typeof window === 'undefined') return;

  const sessions = generateMockSessions();

  // Calculate stats
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
  const currentStreak = 3; // Based on the mock data (today, yesterday, 2 days ago)
  const lastSessionDate = new Date().toDateString();

  const stats = {
    totalSessions,
    totalMinutes,
    currentStreak,
    lastSessionDate,
  };

  localStorage.setItem('praylude_sessions', JSON.stringify(sessions));
  localStorage.setItem('praylude_stats', JSON.stringify(stats));

  console.log('Mock data loaded:', {
    sessions: sessions.length,
    stats,
  });
}

/**
 * Clear all localStorage data for testing
 */
export function clearMockData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('praylude_sessions');
  localStorage.removeItem('praylude_stats');

  console.log('Mock data cleared');
}
