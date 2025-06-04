// "use client";

// import { Suspense } from "react";
// import StreamVideoPlayer from "../../components/StreamVideoPlayer";

// export default function StreamPage() {
//   return (
//     <main className="flex flex-col items-center justify-center p-4">
//       <Suspense fallback={<div>Loading video...</div>}>
//         <StreamVideoPlayer />
//       </Suspense>
//     </main>
//   );
// }

import { Suspense } from "react";
import StreamClient from "./StreamClient";

export default function StreamPage() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading video...</div>}>
        <StreamClient />
      </Suspense>
    </main>
  );
}
