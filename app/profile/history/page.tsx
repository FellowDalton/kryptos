'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCompletedSessions,
  type StoredSession,
} from '@/lib/utils/localStorage';
import { formatDuration } from '@/lib/utils/date';

/**
 * Session history page
 * Displays user's complete meditation session history
 */
export default function HistoryPage() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date');

  useEffect(() => {
    setMounted(true);
    setSessions(getCompletedSessions());
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    } else {
      return b.duration - a.duration;
    }
  });

  // Group sessions by date
  const groupedSessions = sortedSessions.reduce((groups, session) => {
    const date = new Date(session.completedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, StoredSession[]>);

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="bg-surface rounded-[--radius-card] p-8 sm:p-12 shadow-[--shadow-card-dark]">
            <h1 className="text-2xl sm:text-3xl font-medium mb-6 sm:mb-8 text-text-primary">
              Session History
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
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/profile"
            className="text-accent hover:underline mb-4 inline-block text-sm sm:text-base min-h-[44px] flex items-center w-fit"
          >
            ← Back to Profile
          </Link>
          <h1 className="text-3xl sm:text-4xl font-medium text-text-primary">
            Session History
          </h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">
            {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} completed
          </p>
        </div>

        {/* Sort Controls */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => setSortBy('date')}
            className={`px-4 py-2 rounded-[--radius-button] font-medium transition-colors min-h-[44px] ${
              sortBy === 'date'
                ? 'bg-accent text-background'
                : 'bg-surface text-text-primary border border-text-secondary/20'
            }`}
          >
            Sort by Date
          </button>
          <button
            onClick={() => setSortBy('duration')}
            className={`px-4 py-2 rounded-[--radius-button] font-medium transition-colors min-h-[44px] ${
              sortBy === 'duration'
                ? 'bg-accent text-background'
                : 'bg-surface text-text-primary border border-text-secondary/20'
            }`}
          >
            Sort by Duration
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-6 sm:space-y-8">
          {sortBy === 'date' ? (
            // Grouped by date
            Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date} className="bg-surface rounded-[--radius-card] p-6 sm:p-8 shadow-[--shadow-card-dark]">
                <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-text-primary">
                  {date}
                </h2>

                <div className="space-y-4">
                  {dateSessions.map((session) => {
                    const time = new Date(session.completedAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });

                    return (
                      <div
                        key={session.id}
                        className="flex justify-between items-start py-4 border-b border-text-secondary/10 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="text-text-primary font-medium">
                            {session.sessionName}
                          </div>
                          <div className="text-text-secondary text-sm mt-1">
                            {time}
                          </div>
                          {session.notes && (
                            <div className="text-text-secondary text-sm mt-2 italic">
                              "{session.notes}"
                            </div>
                          )}
                        </div>
                        <div className="text-text-primary font-medium ml-4">
                          {formatDuration(session.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            // Flat list sorted by duration
            <div className="bg-surface rounded-[--radius-card] p-6 sm:p-8 shadow-[--shadow-card-dark]">
              <div className="space-y-4">
                {sortedSessions.map((session) => {
                  const date = new Date(session.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const time = new Date(session.completedAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div
                      key={session.id}
                      className="flex justify-between items-start py-4 border-b border-text-secondary/10 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="text-text-primary font-medium">
                          {session.sessionName}
                        </div>
                        <div className="text-text-secondary text-sm mt-1">
                          {date} at {time}
                        </div>
                        {session.notes && (
                          <div className="text-text-secondary text-sm mt-2 italic">
                            "{session.notes}"
                          </div>
                        )}
                      </div>
                      <div className="text-text-primary font-medium ml-4">
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Back to Profile Link */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="/profile"
            className="text-accent hover:underline font-medium text-sm sm:text-base min-h-[44px] inline-flex items-center"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
