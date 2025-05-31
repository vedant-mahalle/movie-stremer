"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StreamPage() {
  const searchParams = useSearchParams();
  const magnet = searchParams?.get("magnet");
  console.log("Magnet URI:", magnet);

  // The streaming server URL
  // Assumes your streaming server runs on port 3001
  // const videoSrc = magnet
  //   ? `http://localhost:3001/stream?magnet=${encodeURIComponent(magnet)}`
  //   : null;
  // console.log("Video Source URL:", videoSrc);
const videoSrc="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"
  return (
    <main className="flex flex-col items-center justify-center p-4">
      {/* {!magnet ? (
        <p>No magnet URI provided.</p>
      ) : (
        <video
          controls
          autoPlay
          className="max-w-full max-h-[80vh] bg-black rounded"
          src={videoSrc || undefined}
        >
          Sorry, your browser doesn't support embedded videos.
        </video>
      )} */}
      <video
          controls
          autoPlay
          className="max-w-full max-h-[80vh] bg-black rounded"
          src={videoSrc || undefined}
        >
          Sorry, your browser doesn't support embedded videos.
        </video>
    </main>
  );
}
