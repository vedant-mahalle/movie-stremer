"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieDetails } from "@/components/movie-details"
import { RelatedMovies } from "@/components/related-movies"
import { getMovieById, type MovieDetails as MovieInfo } from "@/lib/omdb"

interface MoviePageProps {
  params: { id: string }
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<MovieInfo | null>(null)

  useEffect(() => {
    async function fetchMovie() {
      const data = await getMovieById(params.id)
      setMovie(data)
    }
    fetchMovie()
  }, [params.id])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MovieDetails movieId={params.id} />
        <div className="container mx-auto px-4 py-8">
          <RelatedMovies 
            genre={movie?.Genre?.split(', ')[0]} 
            year={movie?.Year}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
