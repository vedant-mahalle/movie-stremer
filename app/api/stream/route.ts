import { NextRequest, NextResponse } from 'next/server';
import WebTorrent from 'webtorrent';
import { v4 as uuidv4 } from 'uuid';

// Store active streams in memory (in production, use Redis or database)
declare global {
  var activeStreams: Map<string, any>;
}

if (!global.activeStreams) {
  global.activeStreams = new Map();
}

interface StreamInfo {
  id: string;
  magnet: string;
  torrent: any;
  status: 'starting' | 'downloading' | 'ready' | 'error' | 'completed';
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  peers: number;
  files: any[];
  error?: string;
  createdAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { magnet } = await request.json();

    if (!magnet) {
      return NextResponse.json(
        { error: 'Magnet link is required' },
        { status: 400 }
      );
    }

    if (!magnet.startsWith('magnet:?')) {
      return NextResponse.json(
        { error: 'Invalid magnet link format' },
        { status: 400 }
      );
    }

    // Generate unique stream ID
    const streamId = uuidv4();

    // Create stream info
    const streamInfo: StreamInfo = {
      id: streamId,
      magnet,
      torrent: null,
      status: 'starting',
      progress: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      peers: 0,
      files: [],
      createdAt: new Date(),
    };

    // Store stream info
    global.activeStreams.set(streamId, streamInfo);

    // Start torrent in background
    startTorrent(streamId, magnet);

    return NextResponse.json({
      streamId,
      status: 'starting',
      message: 'Stream started successfully',
    });

  } catch (error) {
    console.error('Error starting stream:', error);
    return NextResponse.json(
      { error: 'Failed to start stream' },
      { status: 500 }
    );
  }
}

function startTorrent(streamId: string, magnet: string) {
  const streamInfo = global.activeStreams.get(streamId);
  if (!streamInfo) return;

  try {
    const client = new WebTorrent();

    // Store all files in /streams/<streamId>
    const path = process.cwd() + '/streams/' + streamId;
    client.add(magnet, { path }, (torrent) => {
      streamInfo.torrent = torrent;
      streamInfo.status = 'downloading';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      streamInfo.files = (torrent.files as any[])
        .filter((file: any) => file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm'))
        .map((file: any) => ({
          name: file.name,
          length: file.length,
          path: file.path,
          streamable: false,
        }));

      console.log(`Torrent added: ${torrent.name}`);

      // Update progress
      torrent.on('download', () => {
        if (streamInfo) {
          streamInfo.progress = Math.floor((torrent.downloaded / torrent.length) * 100);
          streamInfo.downloadSpeed = torrent.downloadSpeed;
          streamInfo.uploadSpeed = torrent.uploadSpeed;
          streamInfo.peers = torrent.numPeers;

          // Check if video files are streamable
          torrent.files.forEach((file: any, index: number) => {
            if (isVideoFile(file.name) && file.downloaded > 0) {
              streamInfo.files[index].streamable = true;
            }
          });

          // Mark as ready if we have streamable video files
          const hasStreamableVideo = streamInfo.files.some(
            (file) => isVideoFile(file.name) && file.streamable
          );

          if (hasStreamableVideo && streamInfo.status === 'downloading') {
            streamInfo.status = 'ready';
          }
        }
      });

      torrent.on('done', () => {
        if (streamInfo) {
          streamInfo.status = 'completed';
          streamInfo.progress = 100;
        }
      });

      torrent.on('error', (error) => {
        if (streamInfo) {
          streamInfo.status = 'error';
          streamInfo.error = error.message;
        }
      });
    });

    client.on('error', (error) => {
      if (streamInfo) {
        streamInfo.status = 'error';
        streamInfo.error = error.message;
      }
    });

  } catch (error) {
    if (streamInfo) {
      streamInfo.status = 'error';
      streamInfo.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }
}

function isVideoFile(filename: string): boolean {
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp'];
  const ext = filename.toLowerCase().split('.').pop();
  return videoExtensions.includes(`.${ext}`);
}

export async function GET() {
  const streams = Array.from(global.activeStreams.values()).map(stream => ({
    id: stream.id,
    status: stream.status,
    progress: stream.progress,
    downloadSpeed: stream.downloadSpeed,
    peers: stream.peers,
    files: stream.files.length,
    createdAt: stream.createdAt,
  }));

  return NextResponse.json({
    activeStreams: streams.length,
    streams,
  });
} 