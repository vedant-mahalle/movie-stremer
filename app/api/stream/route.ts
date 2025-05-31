// import express from 'express';
// import rangeParser from 'range-parser';

// let app = null;
// let server = null;
// let engine = null;
// let selectedFile = null;

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const magnetURI = searchParams.get('magnet').trim();

//   if (!magnetURI) {
//     return new Response('Missing magnet URI', { status: 400 });
//   }

//   if (!app) {
//     // Lazy initialize torrent-stream and express app
//     const torrentStream = (await import('torrent-stream')).default;

//     app = express();

//     engine = torrentStream(magnetURI, {
//       connections: 100,
//       uploads: 10,
//       tmp: './tmp',
//       path: './downloads',
//       verify: true,
//       dht: true,
//       tracker: true,
//     });

//     engine.on('ready', () => {
//       engine.files.forEach((file) => {
//         console.log('Found file:', file.name);
//         if (file.name.endsWith('.mp4')) {
//           selectedFile = file;
//           console.log('Selected file for streaming:', selectedFile.name);
//         }
//       });
//       if (!selectedFile) {
//         console.error('No video file found in the torrent.');
//       }
//     });

//     app.get('/video', (req, res) => {
//       if (!selectedFile) {
//         return res.status(404).send('Video not ready yet.');
//       }

//       const fileSize = selectedFile.length;
//       const range = req.headers.range;

//       if (!range) {
//         res.writeHead(200, {
//           'Content-Length': fileSize,
//           'Content-Type': 'video/mp4',
//         });
//         selectedFile.createReadStream().pipe(res);
//       } else {
//         const ranges = rangeParser(fileSize, range);

//         if (ranges === -1 || ranges === -2) {
//           return res.status(416).send('Requested Range Not Satisfiable');
//         }

//         const { start, end } = ranges[0];
//         const chunkSize = end - start + 1;

//         res.writeHead(206, {
//           'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//           'Accept-Ranges': 'bytes',
//           'Content-Length': chunkSize,
//           'Content-Type': 'video/mp4',
//         });

//         selectedFile.createReadStream({ start, end }).pipe(res);
//       }
//     });

//     // You need to start the express server on some port,
//     // but Next.js API routes don't support running an express server like this directly.
//     // Instead, you should implement streaming with Next.js native API route handlers,
//     // or run this torrent streaming server separately outside Next.js.
//   }

//   return new Response('Streaming initialized', { status: 200 });
// }
// pages/api/stream.ts
// app/api/stream/route.ts
import { NextRequest } from 'next/server';
import { spawn } from 'child_process';

let serverRunning = false;

export async function POST(req: NextRequest) {
    const { magnet } = await req.json();
    console.log(magnet)

  if (!magnet) {
    console.log("Magnet link is required")
    return new Response(JSON.stringify({ error: 'Magnet link is required' }), { status: 400 });
  }

  if (serverRunning) {
    console.log("Server already running")
    return new Response(JSON.stringify({ message: 'Server already running' }), { status: 200 });
  }

  spawn('node', ['path/to/server.js', magnet], {
    detached: true,
    stdio: 'ignore',
  }).unref();

  serverRunning = true;

  return new Response(JSON.stringify({ message: 'Streaming server started' }), { status: 200 });
}
