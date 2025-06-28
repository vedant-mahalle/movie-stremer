import { NextRequest, NextResponse } from 'next/server';

// Import the activeStreams from the main stream route
// In a real app, you'd use a shared database or Redis
declare global {
  var activeStreams: Map<string, any>;
}

if (!global.activeStreams) {
  global.activeStreams = new Map();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: streamId } = await params;
    const streamInfo = global.activeStreams.get(streamId);

    if (!streamInfo) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: streamInfo.id,
      status: streamInfo.status,
      progress: streamInfo.progress,
      downloadSpeed: streamInfo.downloadSpeed,
      uploadSpeed: streamInfo.uploadSpeed,
      peers: streamInfo.peers,
      files: streamInfo.files,
      error: streamInfo.error,
      createdAt: streamInfo.createdAt,
    });

  } catch (error) {
    console.error('Error getting stream status:', error);
    return NextResponse.json(
      { error: 'Failed to get stream status' },
      { status: 500 }
    );
  }
} 