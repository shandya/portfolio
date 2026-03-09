import { NextResponse } from 'next/server';
import { getWorkData } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const work = await getWorkData();
    return NextResponse.json({ Work: work });
  } catch (error) {
    console.error('Failed to fetch work experience from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work data' },
      { status: 500 }
    );
  }
}
