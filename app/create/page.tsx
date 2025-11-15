/**
 * Custom session builder page
 * Allows users to create personalized meditation sessions
 * with technique selection and duration customization for each of the six sections
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Section, Technique, SessionTechnique, CustomSession } from '@/types';

interface SectionSelection {
  section: Section;
  selectedTechniqueId: string | null; // null means skip this section
  duration: number;
  availableTechniques: Technique[];
}

export default function CreatePage() {
  const router = useRouter();
  const [sectionSelections, setSectionSelections] = useState<SectionSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionName, setSessionName] = useState('My Custom Session');
  const [saving, setSaving] = useState(false);

  // Load sections and techniques on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch sections from API
        const sectionsResponse = await fetch('/api/sections');
        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch sections');
        }
        const sections: Section[] = await sectionsResponse.json();

        const selections: SectionSelection[] = [];

        // Fetch techniques for each section
        for (const section of sections) {
          const techniquesResponse = await fetch(
            `/api/techniques?sectionId=${encodeURIComponent(section.id)}`
          );
          if (!techniquesResponse.ok) {
            throw new Error(`Failed to fetch techniques for ${section.id}`);
          }
          const techniques: Technique[] = await techniquesResponse.json();
          const defaultTechnique = techniques.length > 0 ? techniques[0] : null;

          selections.push({
            section,
            selectedTechniqueId: defaultTechnique?.id || null,
            duration: defaultTechnique?.defaultDuration || 0,
            availableTechniques: techniques,
          });
        }

        setSectionSelections(selections);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load sections:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle technique selection change
  const handleTechniqueChange = (sectionIndex: number, techniqueId: string) => {
    setSectionSelections((prev) => {
      const updated = [...prev];
      const selection = updated[sectionIndex];

      if (techniqueId === 'skip') {
        selection.selectedTechniqueId = null;
        selection.duration = 0;
      } else {
        const technique = selection.availableTechniques.find((t) => t.id === techniqueId);
        if (technique) {
          selection.selectedTechniqueId = technique.id;
          selection.duration = technique.defaultDuration;
        }
      }

      return updated;
    });
  };

  // Handle duration change
  const handleDurationChange = (sectionIndex: number, duration: number) => {
    setSectionSelections((prev) => {
      const updated = [...prev];
      updated[sectionIndex].duration = duration;
      return updated;
    });
  };

  // Calculate total duration in minutes
  const getTotalDuration = (): number => {
    const totalSeconds = sectionSelections.reduce((sum, selection) => {
      return sum + (selection.selectedTechniqueId ? selection.duration : 0);
    }, 0);
    return Math.round(totalSeconds / 60);
  };

  // Get min/max duration for selected technique
  const getTechniqueBounds = (selection: SectionSelection): { min: number; max: number } => {
    if (!selection.selectedTechniqueId) {
      return { min: 0, max: 0 };
    }
    const technique = selection.availableTechniques.find(
      (t) => t.id === selection.selectedTechniqueId
    );
    return {
      min: technique?.minDuration || 0,
      max: technique?.maxDuration || 600,
    };
  };

  // Save custom session to localStorage
  const handleSave = () => {
    setSaving(true);

    try {
      // Build session techniques array
      const techniques: SessionTechnique[] = sectionSelections
        .filter((sel) => sel.selectedTechniqueId !== null)
        .map((sel, index) => ({
          sectionId: sel.section.id,
          techniqueId: sel.selectedTechniqueId,
          duration: sel.duration,
          order: sel.section.order,
        }));

      // Validate at least one section is selected
      if (techniques.length === 0) {
        alert('Please select at least one technique for your session.');
        setSaving(false);
        return;
      }

      // Create custom session object
      const customSession: CustomSession = {
        id: `custom-${Date.now()}`,
        userId: 'local-user', // Phase 1: Local user
        name: sessionName,
        description: 'Custom meditation session',
        techniques,
        totalDuration: getTotalDuration() * 60,
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingSessions = JSON.parse(
        localStorage.getItem('customSessions') || '[]'
      ) as CustomSession[];
      existingSessions.push(customSession);
      localStorage.setItem('customSessions', JSON.stringify(existingSessions));

      alert('Custom session saved successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save session. Please try again.');
      setSaving(false);
    }
  };

  // Start meditation with current configuration
  const handleStartMeditation = () => {
    // Build session techniques array
    const techniques: SessionTechnique[] = sectionSelections
      .filter((sel) => sel.selectedTechniqueId !== null)
      .map((sel) => ({
        sectionId: sel.section.id,
        techniqueId: sel.selectedTechniqueId,
        duration: sel.duration,
        order: sel.section.order,
      }));

    // Validate
    if (techniques.length === 0) {
      alert('Please select at least one technique to begin meditation.');
      return;
    }

    // Store temporary session and navigate to player
    const tempSession = {
      techniques,
      totalDuration: getTotalDuration() * 60,
    };
    localStorage.setItem('tempSession', JSON.stringify(tempSession));
    router.push('/play');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Loading session builder...</div>
      </div>
    );
  }

  const totalMinutes = getTotalDuration();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 mb-3">
            Create Your Custom Meditation
          </h1>
          <p className="text-stone-600 text-lg">
            Choose techniques for each section and customize durations to craft your perfect meditation session.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Session Name Input */}
        <div className="mb-12">
          <label htmlFor="session-name" className="block text-sm font-medium text-stone-700 mb-2">
            Session Name
          </label>
          <input
            id="session-name"
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
            placeholder="Enter a name for your custom session"
          />
        </div>

        {/* Section Selectors */}
        <div className="space-y-8 md:space-y-12">
          {sectionSelections.map((selection, index) => {
            const bounds = getTechniqueBounds(selection);
            const selectedTechnique = selection.availableTechniques.find(
              (t) => t.id === selection.selectedTechniqueId
            );

            return (
              <div
                key={selection.section.id}
                className="bg-white rounded-lg border border-stone-200 p-6 md:p-8"
              >
                {/* Section Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-light text-stone-900 mb-2">
                    {selection.section.displayName}
                  </h2>
                  <p className="text-stone-600">
                    {selection.section.description}
                  </p>
                </div>

                {/* Technique Selector */}
                <div className="mb-6">
                  <label
                    htmlFor={`technique-${index}`}
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Select Technique
                  </label>
                  <select
                    id={`technique-${index}`}
                    value={selection.selectedTechniqueId || 'skip'}
                    onChange={(e) => handleTechniqueChange(index, e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent bg-white"
                  >
                    <option value="skip">Skip this section</option>
                    {selection.availableTechniques.map((technique) => (
                      <option key={technique.id} value={technique.id}>
                        {technique.name} ({technique.difficulty})
                      </option>
                    ))}
                  </select>
                  {selectedTechnique && (
                    <p className="mt-2 text-sm text-stone-600">
                      {selectedTechnique.description}
                    </p>
                  )}
                </div>

                {/* Duration Slider */}
                {selection.selectedTechniqueId && (
                  <div>
                    <label
                      htmlFor={`duration-${index}`}
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      Duration: {Math.round(selection.duration / 60)} min {selection.duration % 60} sec
                    </label>
                    <input
                      id={`duration-${index}`}
                      type="range"
                      min={bounds.min}
                      max={bounds.max}
                      step={15}
                      value={selection.duration}
                      onChange={(e) =>
                        handleDurationChange(index, parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-stone-500 mt-1">
                      <span>{Math.round(bounds.min / 60)} min</span>
                      <span>{Math.round(bounds.max / 60)} min</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Total Duration & Actions */}
        <div className="mt-12 bg-white rounded-lg border border-stone-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm text-stone-600 mb-1">Total Duration</div>
              <div className="text-4xl font-light text-stone-900">
                {totalMinutes} {totalMinutes === 1 ? 'minute' : 'minutes'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Custom Session'}
              </button>
              <button
                onClick={handleStartMeditation}
                className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                Begin Meditation →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #292524;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #292524;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
