// "use client";

// import { useEffect, useState, useRef } from 'react';
// import { useSearchParams } from 'next/navigation';
// import WebTorrent from 'webtorrent';

// export default function StreamPage() {
//   const searchParams = useSearchParams();
//   const magnetURI = searchParams.get('magnet');
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState<number>(0); // Added for download progress

//   useEffect(() => {
//     if (!magnetURI) {
//       setError('No magnet link provided.');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setProgress(0);

//     const webtorrentClient = new WebTorrent();
//     let currentTorrent: WebTorrent.Torrent | null = null; // To hold the torrent instance

//     webtorrentClient.add(magnetURI, (torrent: WebTorrent.Torrent) => {
//       currentTorrent = torrent; // Store the torrent instance
//       console.log('Torrent metadata loaded:', torrent.name);

//       const file: WebTorrent.TorrentFile | undefined = torrent.files.find(
//         (file) => file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.webm') // Added .webm for broader compatibility
//       );

//       if (file) {
//         setLoading(false);
//         file.renderTo(videoRef.current!, {
//           autoplay: true,
//           controls: true,
//         });

//         // Listen for download progress
//         torrent.on('download', () => {
//           const downloaded = torrent.downloaded;
//           const total = torrent.length;
//           if (total > 0) {
//             setProgress(Math.floor((downloaded / total) * 100));
//           }
//         });

//         torrent.on('done', () => {
//           console.log('Torrent download finished!');
//           setProgress(100);
//         });

//       } else {
//         setError('No playable video file (.mp4, .mkv, .webm) found in the torrent.');
//         setLoading(false);
//       }
//     });

//     webtorrentClient.on('error', (err: string | Error) => {
//       console.error('WebTorrent client error:', err);
//       setError(`WebTorrent error: ${typeof err === 'string' ? err : err.message}`);
//       setLoading(false);
//     });

//     return () => {
//       console.log('Cleaning up WebTorrent client...');
//       if (currentTorrent) {
//         currentTorrent.destroy(); // Destroy the specific torrent
//       }
//       webtorrentClient.destroy(); // Destroy the client itself
//     };
//   }, [magnetURI]); // Removed 'client' from dependency array

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white" aria-live="polite">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="ml-4 mt-4 text-lg">Loading stream...</p>
//         {progress > 0 && progress < 100 && (
//           <p className="mt-2 text-md">Downloading: {progress}%</p>
//         )}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-900 text-white" aria-live="assertive">
//         <p className="text-red-500 text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-900">
//       <video ref={videoRef} className="max-h-full max-w-full"></video>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from 'react';

export default function StreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Static video URL (replace with your own video URL)
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  useEffect(() => {
    if (!videoUrl) {
      setError('No video URL provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.src = videoUrl;
      videoElement.load();

      // Handle successful load
      videoElement.onloadeddata = () => {
        setLoading(false);
        videoElement.play().catch((err) => {
          setError(`Playback error: ${err.message}`);
          setLoading(false);
        });
      };

      // Handle loading errors
      videoElement.onerror = () => {
        setError('Error loading video. Please check the URL or try again later.');
        setLoading(false);
      };
    }

    return () => {
      if (videoElement) {
        videoElement.src = ''; // Clear the source on cleanup
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white" aria-live="assertive">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <video
        ref={videoRef}
        className="max-h-full max-w-full"
        controls
        autoPlay
      />
    </div>
  );
}