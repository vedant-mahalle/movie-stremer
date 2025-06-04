"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StreamVideoPlayer() {
  const searchParams = useSearchParams();
  const magnet = searchParams?.get("magnet");
  console.log("Magnet URI:", magnet);

  const videoSrc="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"

  return (
    <video
      controls
      autoPlay
      className="max-w-full max-h-[80vh] bg-black rounded"
      src={videoSrc || undefined}
    >
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
} 