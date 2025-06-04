"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function StreamClient() {
  const searchParams = useSearchParams();
  const magnet = searchParams.get("magnet");

  useEffect(() => {
    console.log("Magnet URI:", magnet);
  }, [magnet]);

  return (
    <div>
      <h2>Magnet Link:</h2>
      <p>{magnet || "No magnet link provided."}</p>
    </div>
  );
}
