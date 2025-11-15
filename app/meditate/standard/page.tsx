/**
 * Standard daily meditation session page
 * Provides the default meditation experience with preset structure
 * Server component that loads session data and renders interactive player
 */

import {
  getStandardDailySession,
  getTechniqueById,
  getSectionById,
} from '@/lib/data/mock-data';
import { Technique, Section } from '@/types';
import MeditationPlayer from '@/components/player/MeditationPlayer';

export default async function StandardMeditatePage() {
  // Load the standard daily session (6 techniques, one per section)
  const sessionTechniques = await getStandardDailySession();

  // Fetch full technique and section details
  const techniques: (Technique | null)[] = [];
  const sections: Section[] = [];
  const durations: number[] = [];

  for (const sessionTechnique of sessionTechniques) {
    // Get technique details
    const technique = sessionTechnique.techniqueId
      ? await getTechniqueById(sessionTechnique.techniqueId)
      : null;
    techniques.push(technique);

    // Get section details
    const section = await getSectionById(sessionTechnique.sectionId);
    if (section) {
      sections.push(section);
    }

    // Store duration
    durations.push(sessionTechnique.duration);
  }

  // Prepare session data for client component
  const sessionData = {
    techniques,
    sections,
    durations,
  };

  return <MeditationPlayer sessionData={sessionData} />;
}
