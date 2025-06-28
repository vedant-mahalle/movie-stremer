import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

declare global {
  var activeStreams: Map<string, any>;
}

if (!global.activeStreams) {
  global.activeStreams = new Map();
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: streamId } = await params;
    const streamInfo = global.activeStreams.get(streamId);
    if (!streamInfo) {
      return NextResponse.json({ error: 'Stream not found' }, { status: 404 });
    }
    // Destroy the torrent
    if (streamInfo.torrent) {
      await new Promise((resolve) => streamInfo.torrent.destroy(resolve));
    }
    // Remove from activeStreams
    global.activeStreams.delete(streamId);
    // Delete files from /streams/<streamId>
    const dirPath = path.join(process.cwd(), 'streams', streamId);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
    return NextResponse.json({ message: 'Stream stopped and cleaned up.' });
  } catch (error) {
    console.error('Error stopping stream:', error);
    return NextResponse.json({ error: 'Failed to stop stream' }, { status: 500 });
  }
} 