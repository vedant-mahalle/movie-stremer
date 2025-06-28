import { NextResponse } from 'next/server';

declare global {
  var activeStreams: Map<string, any>;
}

if (!global.activeStreams) {
  global.activeStreams = new Map();
}

export async function GET() {
  try {
    const activeStreamsCount = global.activeStreams.size;
    const streams = Array.from(global.activeStreams.values()).map(stream => ({
      id: stream.id,
      status: stream.status,
      progress: stream.progress,
      peers: stream.peers,
    }));

    return NextResponse.json({
      status: 'healthy',
      port: process.env.PORT || 3000,
      activeStreams: activeStreamsCount,
      maxStreams: 10, // You can adjust this limit
      uploadEnabled: true,
      streams,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 