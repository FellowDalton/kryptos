'use client';

/**
 * Meditation Player - Interactive client component
 * Handles playback state and section progression
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Technique, Section } from '@/types';
import PlayPauseButton from './PlayPauseButton';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import SectionIndicator from './SectionIndicator';
import { saveSession, getStats, type StoredStats } from '@/lib/utils/localStorage';

interface SessionData {
  techniques: (Technique | null)[];
  sections: Section[];
  durations: number[];
}

interface MeditationPlayerProps {
  sessionData: SessionData;
}

export default function MeditationPlayer({ sessionData }: MeditationPlayerProps) {
  const { techniques, sections, durations } = sessionData;

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showScript, setShowScript] = useState(true);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [completionStats, setCompletionStats] = useState<StoredStats | null>(null);

  // Get current section data
  const currentTechnique = techniques[currentSectionIndex];
  const currentSection = sections[currentSectionIndex];
  const currentDuration = durations[currentSectionIndex];

  // Handle session completion
  const handleSessionComplete = useCallback(() => {
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

    // Save session to localStorage
    saveSession({
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      duration: totalDuration,
      sessionName: 'Standard Meditation',
      notes: undefined,
    });

    // Get updated stats
    const updatedStats = getStats();
    setCompletionStats(updatedStats);
    setShowCompletionOverlay(true);
  }, [durations]);

  // Toggle play/pause
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Reset to beginning
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentSectionIndex(0);
    setElapsedTime(0);
    setShowCompletionOverlay(false);
  }, []);

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;

        // Check if current section is complete
        if (newTime >= currentDuration) {
          // Move to next section
          if (currentSectionIndex < techniques.length - 1) {
            setCurrentSectionIndex((prevIndex) => prevIndex + 1);
            return 0; // Reset elapsed time for new section
          } else {
            // Session complete - save to localStorage
            setIsPlaying(false);
            handleSessionComplete();
            return 0;
          }
        }

        return newTime;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isPlaying, currentSectionIndex, currentDuration, techniques.length, handleSessionComplete]);

  // Calculate total session time
  const totalSessionTime = durations.reduce((sum, duration) => sum + duration, 0);
  const totalElapsedTime = durations
    .slice(0, currentSectionIndex)
    .reduce((sum, duration) => sum + duration, 0) + elapsedTime;

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header - Spacious */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 mb-2">
            Standard Meditation
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            {Math.floor(totalSessionTime / 60)} minutes • {techniques.length} sections
          </p>
        </div>

        {/* Main Player Area - Centered with Ma (negative space) */}
        <div className="space-y-8 sm:space-y-12">
          {/* Current Section Name - Large and Centered */}
          <div className="text-center py-6 sm:py-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4 tracking-wide">
              {currentSection?.displayName || 'Loading...'}
            </h2>
            {currentTechnique && (
              <p className="text-gray-400 text-base sm:text-lg font-light">
                {currentTechnique.name}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <ProgressBar elapsed={elapsedTime} total={currentDuration} />

          {/* Play/Pause Button */}
          <div className="flex justify-center py-4 sm:py-6">
            <PlayPauseButton
              isPlaying={isPlaying}
              onToggle={handleTogglePlay}
              disabled={!currentTechnique}
            />
          </div>

          {/* Timer */}
          <div className="py-3 sm:py-4">
            <Timer elapsed={elapsedTime} total={currentDuration} />
            <div className="text-center text-gray-600 text-xs sm:text-sm mt-2">
              Session: {Math.floor(totalElapsedTime / 60)}:{(totalElapsedTime % 60)
                .toString()
                .padStart(2, '0')} / {Math.floor(totalSessionTime / 60)}:{(totalSessionTime % 60)
                .toString()
                .padStart(2, '0')}
            </div>
          </div>

          {/* Scripture Script (Optional Display) */}
          {currentTechnique && showScript && (
            <div className="py-6 sm:py-8 px-6 sm:px-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <button
                onClick={() => setShowScript(false)}
                className="text-xs text-gray-500 hover:text-gray-300 mb-4 transition-colors min-h-[44px] flex items-center"
              >
                Hide script
              </button>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light whitespace-pre-line">
                {currentTechnique.scriptTemplate.replace(/\{pause\}/g, '...')}
              </p>
              {currentTechnique.scriptureReferences && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700/50">
                  <p className="text-xs sm:text-sm text-gray-500">Scripture References:</p>
                  <p className="text-blue-400 text-xs sm:text-sm mt-1">
                    {currentTechnique.scriptureReferences.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {!showScript && currentTechnique && (
            <div className="text-center">
              <button
                onClick={() => setShowScript(true)}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors min-h-[44px] inline-flex items-center"
              >
                Show script
              </button>
            </div>
          )}

          {/* Section Indicators - Bottom */}
          <div className="pt-8 sm:pt-12">
            <SectionIndicator
              totalSections={techniques.length}
              currentSection={currentSectionIndex}
            />
          </div>

          {/* Reset Button (only show if started) */}
          {(isPlaying || currentSectionIndex > 0 || elapsedTime > 0) && (
            <div className="text-center pt-6 sm:pt-8">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors min-h-[44px] inline-flex items-center"
              >
                Reset to beginning
              </button>
            </div>
          )}
        </div>

        {/* Session Complete Overlay */}
        {showCompletionOverlay && completionStats && (
          <div className="fixed inset-0 bg-gray-900/95 backdrop-blur flex items-center justify-center p-6 sm:p-8 z-50">
            <div className="max-w-md w-full text-center space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light text-white">
                Meditation Complete ✓
              </h2>

              <div className="space-y-2">
                <p className="text-lg sm:text-xl text-gray-300">
                  {formatDuration(totalSessionTime)} completed
                </p>
                <p className="text-base sm:text-lg text-blue-400">
                  {completionStats.currentStreak} day streak!
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href="/profile"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-medium min-h-[44px] flex items-center justify-center"
                >
                  View Profile
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium min-h-[44px] flex items-center justify-center"
                >
                  Start New Meditation
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
