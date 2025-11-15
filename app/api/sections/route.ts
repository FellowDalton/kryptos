/**
 * API route for fetching meditation sections
 * GET /api/sections - Returns all sections
 */
import { NextResponse } from 'next/server';
import { getSections } from '@/lib/data/mock-data';

export async function GET() {
  try {
    const sections = await getSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
