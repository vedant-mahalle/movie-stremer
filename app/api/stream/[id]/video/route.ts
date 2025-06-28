import { NextRequest, NextResponse } from 'next/server';

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
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    const streamInfo = global.activeStreams.get(streamId);

    if (!streamInfo) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    if (streamInfo.status === 'error') {
      return NextResponse.json(
        { error: streamInfo.error || 'Stream error' },
        { status: 500 }
      );
    }

    if (streamInfo.status !== 'ready' && streamInfo.status !== 'completed') {
      return NextResponse.json(
        { error: 'Stream not ready yet', status: streamInfo.status },
        { status: 202 }
      );
    }

    // Find the video file
    let videoFile;
    if (fileName) {
      videoFile = streamInfo.files.find((file: any) => file.name === fileName);
    } else {
      // Prefer .mp4 or .webm files
      videoFile = streamInfo.files.find((file: any) =>
        isVideoFile(file.name) && file.streamable &&
        (file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm'))
      );
      // Fallback to any streamable video file
      if (!videoFile) {
        videoFile = streamInfo.files.find((file: any) => isVideoFile(file.name) && file.streamable);
      }
    }

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No streamable video file found' },
        { status: 404 }
      );
    }

    // Only allow browser-compatible formats
    if (!videoFile.name.toLowerCase().endsWith('.mp4') && !videoFile.name.toLowerCase().endsWith('.webm')) {
      return NextResponse.json(
        { error: 'This video format is not supported by your browser. Please try a different torrent or download the file to play locally.' },
        { status: 415 }
      );
    }

    // Get the file from torrent
    const torrent = streamInfo.torrent;
    const file = torrent.files.find((f: any) => f.name === videoFile.name);

    if (!file) {
      return NextResponse.json(
        { error: 'File not found in torrent' },
        { status: 404 }
      );
    }

    // Create a readable stream
    const range = request.headers.get('range');
    
    if (range) {
      // Handle range requests for seeking
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
      const chunksize = (end - start) + 1;

      const stream = file.createReadStream({ start, end });
      
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': getContentType(file.name),
      };

      return new NextResponse(stream as any, { headers, status: 206 });
    } else {
      // Full file request
      const stream = file.createReadStream();
      
      const headers = {
        'Content-Length': file.length.toString(),
        'Content-Type': getContentType(file.name),
        'Accept-Ranges': 'bytes',
      };

      return new NextResponse(stream as any, { headers });
    }

  } catch (error) {
    console.error('Error streaming video:', error);
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    );
  }
}

function isVideoFile(filename: string): boolean {
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp'];
  const ext = filename.toLowerCase().split('.').pop();
  return videoExtensions.includes(`.${ext}`);
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const contentTypes: { [key: string]: string } = {
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    'm4v': 'video/x-m4v',
    '3gp': 'video/3gpp',
  };
  return contentTypes[ext || ''] || 'application/octet-stream';
} 