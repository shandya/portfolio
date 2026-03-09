import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const portfolio = await getPortfolioData();
    return NextResponse.json({ Portfolio: portfolio });
  } catch (error) {
    console.error('Failed to fetch portfolio from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}
