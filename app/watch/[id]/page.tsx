import { Header } from "@/components/header"
import { VideoPlayer } from "@/components/video-player"
import { WatchPageInfo } from "@/components/watch-page-info"

interface WatchPageProps {
  params: Promise<{ id: string }>
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <VideoPlayer movieId={id} />
        <WatchPageInfo movieId={id} />
      </main>
    </div>
  )
}
