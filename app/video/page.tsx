// app/video/page.tsx
"use client";

import { useEffect, useRef } from "react";
import WebTorrent from "webtorrent";
import { useSearchParams } from "next/navigation";

export default function VideoPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const searchParams = useSearchParams();
  const magnetURI = searchParams.get("magnet");

  useEffect(() => {
    if (!magnetURI || !videoRef.current) return;

    const client = new WebTorrent();

    client.add(magnetURI, (torrent) => {
      const file = torrent.files.find((f) =>
        f.name.endsWith(".mp4") || f.name.endsWith(".webm") || f.name.endsWith(".mkv")
      );
      if (file) {
        file.renderTo(videoRef.current!);
      }
    });

    return () => client.destroy();
  }, [magnetURI]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <video ref={videoRef} controls className="w-full max-w-4xl bg-black" />
    </div>
  );
}
