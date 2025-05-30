"use client"

import { HeroSection } from "@/components/hero-section"
import { MovieGrid } from "@/components/movie-grid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <div className="container mx-auto px-4 py-8 space-y-12">
          <MovieGrid title="Trending Now" category="trending" />
          <MovieGrid title="New Releases" category="new" />
          <MovieGrid title="Popular Movies" category="popular" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
