/**
 * Mock data access layer
 * Phase 1: Provides mock data for development before Supabase integration
 *
 * This module loads meditation data from /data/mock-techniques.json and provides
 * helper functions to query sections and techniques. All functions are async
 * to prepare for future database migration.
 */

import { Section, Technique, SessionTechnique, SectionName, Difficulty } from '@/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

// ============================================================================
// In-Memory Cache
// ============================================================================

interface MockData {
  sections: Section[];
  techniques: Technique[];
}

let cachedData: MockData | null = null;

// ============================================================================
// Data Loading
// ============================================================================

/**
 * Internal function to load and parse mock data from JSON file
 * Caches the data in memory to avoid repeated file reads
 *
 * @throws {Error} If JSON file is not found or invalid
 */
async function loadMockData(): Promise<MockData> {
  // Return cached data if available
  if (cachedData) {
    return cachedData;
  }

  try {
    const jsonPath = join(process.cwd(), 'data', 'mock-techniques.json');
    const fileContent = await readFile(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Validate data structure
    if (!data.sections || !Array.isArray(data.sections)) {
      throw new Error('Invalid mock data: sections array not found');
    }
    if (!data.techniques || !Array.isArray(data.techniques)) {
      throw new Error('Invalid mock data: techniques array not found');
    }

    // Cache the data
    cachedData = {
      sections: data.sections,
      techniques: data.techniques
    };

    return cachedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load mock data: ${error.message}`);
    }
    throw new Error('Failed to load mock data: Unknown error');
  }
}

// ============================================================================
// Section Queries
// ============================================================================

/**
 * Get all six meditation sections
 * Sections are returned in their natural order (1-6)
 *
 * @returns Promise<Section[]> Array of all meditation sections
 * @example
 * const sections = await getSections();
 * // Returns: [Welcome, Mind, Body, Spirit, Meditation, Incorporate]
 */
export async function getSections(): Promise<Section[]> {
  const data = await loadMockData();
  // Return sections sorted by order
  return [...data.sections].sort((a, b) => a.order - b.order);
}

/**
 * Get a specific section by its ID
 *
 * @param id - The unique section identifier (e.g., "section-welcome")
 * @returns Promise<Section | null> The section if found, null otherwise
 * @example
 * const section = await getSectionById('section-mind');
 * if (section) console.log(section.displayName); // "Mind"
 */
export async function getSectionById(id: string): Promise<Section | null> {
  const data = await loadMockData();
  const section = data.sections.find(s => s.id === id);
  return section || null;
}

/**
 * Get a section by its name (e.g., 'welcome', 'mind', 'body')
 *
 * @param name - The section name (one of six: welcome, mind, body, spirit, meditation, incorporate)
 * @returns Promise<Section | null> The section if found, null otherwise
 * @example
 * const section = await getSectionByName('mind');
 * if (section) console.log(section.id); // "section-mind"
 */
export async function getSectionByName(name: SectionName): Promise<Section | null> {
  const data = await loadMockData();
  const section = data.sections.find(s => s.name === name);
  return section || null;
}

// ============================================================================
// Technique Queries
// ============================================================================

/**
 * Get all meditation techniques across all sections
 *
 * @returns Promise<Technique[]> Array of all techniques
 * @example
 * const techniques = await getTechniques();
 * console.log(`Total techniques: ${techniques.length}`);
 */
export async function getTechniques(): Promise<Technique[]> {
  const data = await loadMockData();
  return [...data.techniques];
}

/**
 * Get a specific technique by its ID
 *
 * @param id - The unique technique identifier (e.g., "welcome-001")
 * @returns Promise<Technique | null> The technique if found, null otherwise
 * @example
 * const technique = await getTechniqueById('mind-001');
 * if (technique) console.log(technique.name); // "Sacred Room Visualization"
 */
export async function getTechniqueById(id: string): Promise<Technique | null> {
  const data = await loadMockData();
  const technique = data.techniques.find(t => t.id === id);
  return technique || null;
}

/**
 * Get all techniques for a specific section
 *
 * @param sectionId - The section identifier (e.g., "section-mind")
 * @returns Promise<Technique[]> Array of techniques in the section
 * @example
 * const mindTechniques = await getTechniquesBySection('section-mind');
 * console.log(`Mind techniques: ${mindTechniques.length}`);
 */
export async function getTechniquesBySection(sectionId: string): Promise<Technique[]> {
  const data = await loadMockData();
  return data.techniques.filter(t => t.sectionId === sectionId);
}

/**
 * Filter techniques by difficulty level
 *
 * @param difficulty - The difficulty level (beginner, intermediate, or advanced)
 * @returns Promise<Technique[]> Array of techniques matching the difficulty
 * @example
 * const beginnerTechniques = await getTechniquesByDifficulty('beginner');
 * console.log(`Beginner techniques: ${beginnerTechniques.length}`);
 */
export async function getTechniquesByDifficulty(difficulty: Difficulty): Promise<Technique[]> {
  const data = await loadMockData();
  return data.techniques.filter(t => t.difficulty === difficulty);
}

// ============================================================================
// Session Builders
// ============================================================================

/**
 * Generate a standard daily session with one technique per section
 * Selects the first technique from each section to create a complete meditation
 *
 * @returns Promise<SessionTechnique[]> Array of 6 session techniques (one per section)
 * @example
 * const dailySession = await getStandardDailySession();
 * const totalTime = calculateSessionDuration(dailySession);
 * console.log(`Standard session: ${totalTime} seconds`);
 */
export async function getStandardDailySession(): Promise<SessionTechnique[]> {
  const sections = await getSections();
  const sessionTechniques: SessionTechnique[] = [];

  for (const section of sections) {
    // Get all techniques for this section
    const techniques = await getTechniquesBySection(section.id);

    // Select the first technique (could be randomized or user-preference later)
    const selectedTechnique = techniques.length > 0 ? techniques[0] : null;

    sessionTechniques.push({
      sectionId: section.id,
      techniqueId: selectedTechnique?.id || null,
      duration: selectedTechnique?.defaultDuration || 0,
      order: section.order
    });
  }

  return sessionTechniques;
}

/**
 * Calculate total session duration from an array of session techniques
 * Sums up the duration of all techniques in the session
 *
 * @param sessionTechniques - Array of techniques with their durations
 * @returns number - Total duration in seconds
 * @example
 * const session = await getStandardDailySession();
 * const duration = calculateSessionDuration(session);
 * console.log(`Total: ${Math.floor(duration / 60)} minutes`);
 */
export function calculateSessionDuration(sessionTechniques: SessionTechnique[]): number {
  return sessionTechniques.reduce((total, technique) => {
    return total + technique.duration;
  }, 0);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clear the in-memory cache
 * Useful for testing or when data needs to be reloaded
 *
 * @example
 * clearCache(); // Next query will reload from JSON
 */
export function clearCache(): void {
  cachedData = null;
}

/**
 * Get summary statistics about the meditation data
 *
 * @returns Promise with counts of sections, techniques, and techniques per section
 * @example
 * const stats = await getDataStats();
 * console.log(`Sections: ${stats.sectionCount}, Techniques: ${stats.techniqueCount}`);
 */
export async function getDataStats() {
  const data = await loadMockData();
  const sections = data.sections;
  const techniques = data.techniques;

  const techniquesBySection = sections.map(section => ({
    sectionName: section.displayName,
    count: techniques.filter(t => t.sectionId === section.id).length
  }));

  return {
    sectionCount: sections.length,
    techniqueCount: techniques.length,
    techniquesBySection,
    difficultyBreakdown: {
      beginner: techniques.filter(t => t.difficulty === 'beginner').length,
      intermediate: techniques.filter(t => t.difficulty === 'intermediate').length,
      advanced: techniques.filter(t => t.difficulty === 'advanced').length
    }
  };
}

// ============================================================================
// Legacy Compatibility (for existing code)
// ============================================================================

export const mockSessions = [
  {
    id: '1',
    name: 'Morning Meditation',
    duration: 900, // 15 minutes in seconds
    isPublic: true
  }
];

export const mockTechniques = [
  {
    id: '1',
    sectionId: '1',
    name: 'Sample Technique',
    description: 'A sample meditation technique',
    defaultDuration: 300
  }
];

export function getMockSessions() {
  return mockSessions;
}

export function getMockTechniques() {
  return mockTechniques;
}
