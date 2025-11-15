'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCompletedSessions,
  getStats,
  getFavoriteTimeOfDay,
  formatTotalTime,
  type StoredSession,
  type StoredStats,
} from '@/lib/utils/localStorage';
import { formatDuration } from '@/lib/utils/date';

/**
 * User profile page
 * Displays meditation journey stats and recent sessions
 */
export default function ProfilePage() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [stats, setStats] = useState<StoredStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    lastSessionDate: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSessions(getCompletedSessions());
    setStats(getStats());
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const recentSessions = sessions
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const favoriteTime = getFavoriteTimeOfDay(sessions);
  const totalTimeFormatted = formatTotalTime(stats.totalMinutes);

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="bg-surface rounded-[--radius-card] p-8 sm:p-12 shadow-[--shadow-card-dark]">
            <h1 className="text-2xl sm:text-3xl font-medium mb-6 sm:mb-8 text-text-primary">
              Your Meditation Journey
            </h1>

            <p className="text-text-secondary mb-8 sm:mb-12 text-base sm:text-lg">
              No sessions completed yet
            </p>

            <Link
              href="/meditate"
              className="inline-block px-8 py-4 bg-accent text-background rounded-[--radius-button] font-medium hover:opacity-90 transition-opacity min-h-[44px]"
            >
              Begin Your First Meditation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-medium mb-8 sm:mb-12 text-text-primary">
          Your Meditation Journey
        </h1>

        {/* Stats Card */}
        <div className="bg-surface rounded-[--radius-card] p-6 sm:p-8 mb-8 sm:mb-12 shadow-[--shadow-card-dark]">
          <h2 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 text-text-primary">
            Your Stats
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-3 border-b border-text-secondary/10">
              <span className="text-text-secondary text-sm sm:text-base">Total Sessions</span>
              <span className="text-text-primary font-medium text-lg sm:text-xl">
                {stats.totalSessions}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-text-secondary/10">
              <span className="text-text-secondary text-sm sm:text-base">Current Streak</span>
              <span className="text-text-primary font-medium text-lg sm:text-xl">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-text-secondary/10">
              <span className="text-text-secondary text-sm sm:text-base">Total Time</span>
              <span className="text-text-primary font-medium text-lg sm:text-xl">
                {totalTimeFormatted}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-text-secondary text-sm sm:text-base">Favorite Time</span>
              <span className="text-text-primary font-medium text-lg sm:text-xl">
                {favoriteTime}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-12">
          <Link
            href="/meditate"
            className="bg-accent text-background rounded-[--radius-button] px-6 py-4 text-center font-medium hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center"
          >
            Begin Meditation
          </Link>

          <Link
            href="/profile/history"
            className="bg-surface text-text-primary rounded-[--radius-button] px-6 py-4 text-center font-medium border border-text-secondary/20 hover:border-text-secondary/40 transition-colors min-h-[44px] flex items-center justify-center"
          >
            View Full History
          </Link>
        </div>

        {/* Recent Sessions */}
        <div className="bg-surface rounded-[--radius-card] p-6 sm:p-8 shadow-[--shadow-card-dark]">
          <h2 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 text-text-primary">
            Recent Sessions
          </h2>

          <div className="space-y-4">
            {recentSessions.map((session) => {
              const date = new Date(session.completedAt);
              const isToday = date.toDateString() === new Date().toDateString();
              const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();

              let dateLabel = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              if (isToday) {
                dateLabel = 'Today';
              } else if (isYesterday) {
                dateLabel = 'Yesterday';
              }

              const timeLabel = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={session.id}
                  className="flex justify-between items-center py-4 border-b border-text-secondary/10 last:border-0"
                >
                  <div>
                    <div className="text-text-primary font-medium">
                      {session.sessionName}
                    </div>
                    <div className="text-text-secondary text-sm mt-1">
                      {dateLabel}, {timeLabel}
                    </div>
                  </div>
                  <div className="text-text-primary font-medium">
                    {formatDuration(session.duration)}
                  </div>
                </div>
              );
            })}
          </div>

          {sessions.length > 5 && (
            <div className="mt-8 text-center">
              <Link
                href="/profile/history"
                className="text-accent hover:underline font-medium"
              >
                View All Sessions →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
