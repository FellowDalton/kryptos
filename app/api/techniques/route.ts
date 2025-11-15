/**
 * API route for fetching meditation techniques
 * GET /api/techniques?sectionId=xxx - Returns techniques for a specific section
 */
import { NextResponse } from 'next/server';
import { getTechniquesBySection } from '@/lib/data/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    if (!sectionId) {
      return NextResponse.json(
        { error: 'sectionId query parameter is required' },
        { status: 400 }
      );
    }

    const techniques = await getTechniquesBySection(sectionId);
    return NextResponse.json(techniques);
  } catch (error) {
    console.error('Failed to fetch techniques:', error);
    return NextResponse.json(
      { error: 'Failed to fetch techniques' },
      { status: 500 }
    );
  }
}
