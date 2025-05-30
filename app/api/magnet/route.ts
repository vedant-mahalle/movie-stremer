import { NextResponse } from 'next/server';
import { getMagnetLink } from '@/lib/torrent-stream/getlink';

export async function POST(request: Request) {
  try {
    const { movieName } = await request.json();
    
    if (!movieName) {
      return NextResponse.json(
        { error: 'Movie name is required' },
        { status: 400 }
      );
    }

    const magnetLink = await getMagnetLink(movieName);
    return NextResponse.json({ magnetLink });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch magnet link' },
      { status: 500 }
    );
  }
} 