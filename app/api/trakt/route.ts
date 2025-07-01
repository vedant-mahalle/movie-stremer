import { NextResponse } from 'next/server';

const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID;
if (!TRAKT_CLIENT_ID) {
  throw new Error('TRAKT_CLIENT_ID is not set in environment variables');
}
const BASE_URL = 'https://api.trakt.tv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'trending'; // trending, popular, new
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  let traktEndpoint = '';
  switch (category) {
    case 'trending':
      traktEndpoint = `/movies/trending?limit=${limit}`;
      break;
    case 'popular':
      traktEndpoint = `/movies/popular?limit=${limit}`;
      break;
    case 'new':
      traktEndpoint = `/movies/anticipated?limit=${limit}`;
      break;
    default:
      traktEndpoint = `/movies/trending?limit=${limit}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${traktEndpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': TRAKT_CLIENT_ID,
        'User-Agent': 'TraktTrendingMovieFetcher/1.0.0',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.Error || 'Failed to fetch data from Trakt' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Trakt via proxy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 