import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const id = searchParams.get('id');
  const type = searchParams.get('type'); // 'movie' or 'series'
  
  const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY; // Access server-side env variable
  
  if (!OMDB_API_KEY) {
    return NextResponse.json({ error: 'OMDB API Key not configured' }, { status: 500 });
  }

  let apiUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

  if (query) {
    apiUrl += `&s=${encodeURIComponent(query)}`;
    if (type) {
      apiUrl += `&type=${type}`;
    }
  } else if (id) {
    apiUrl += `&i=${encodeURIComponent(id)}&plot=full`;
  } else {
    return NextResponse.json({ error: 'Missing query or ID' }, { status: 400 });
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.Error || 'Failed to fetch data from OMDb' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from OMDb via proxy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 