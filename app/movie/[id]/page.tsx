import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieDetails } from "@/components/movie-details"
import { RelatedMovies } from "@/components/related-movies"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MovieDetails movieId={id} />
        <div className="container mx-auto px-4 py-8">
          <RelatedMovies />
        </div>
      </main>
      <Footer />
    </div>
  )
}
