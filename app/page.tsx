import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MovieGrid } from "@/components/movie-grid"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <div className="container mx-auto px-4 py-8 space-y-12">
          <MovieGrid title="Trending Now" />
          <MovieGrid title="Popular Movies" />
          <MovieGrid title="New Releases" />
          <MovieGrid title="Top Rated" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
