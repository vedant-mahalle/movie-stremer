import { NextResponse } from 'next/server';
import { piratebay } from 'piratebay-scraper';

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { movieName } = await request.json();
    
    if (!movieName) {
      return NextResponse.json(
        { error: 'Movie name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Server-side request to TPB
    const results = await piratebay.search(movieName);
    const magnetLink = results?.[0]?.['link'] || null;

    return NextResponse.json(
      { magnetLink }, 
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magnet link' },
      { status: 500, headers: corsHeaders }
    );
  }
} 