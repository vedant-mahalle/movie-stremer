"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useSearchParams } from "next/navigation"
import { SearchResultCard } from "@/components/search-result-card"
import { SearchFilters } from "@/components/search-filters"
import { toast } from "sonner"

interface MovieInfo {
  title: string
  year: string
  poster: string
  plot: string
  rating: string
  genre: string
}

interface TorrentResult {
  name: string
  size: string
  seeders: number
  leechers: number
  uploadDate: string
  magnet: string
  movieInfo: MovieInfo | null
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("movie")
  const [results, setResults] = useState<TorrentResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("seeders")
  const [minSeeders, setMinSeeders] = useState(0)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?movie=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch results")
        }

        setResults(data.results || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
        toast.error(err instanceof Error ? err.message : "Failed to fetch results")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const handleDownload = async (magnet: string) => {
    try {
      toast.success("Starting stream...");
      // Here you can implement the streaming logic
      console.log("Magnet link:", magnet);
      
      // You can add your streaming implementation here
      // For example, redirect to a player page or start the download
      
    } catch (error) {
      toast.error("Failed to start streaming");
    }
  }

  const filteredAndSortedResults = useMemo(() => {
    return results
      .filter(result => result.seeders >= minSeeders)
      .sort((a, b) => {
        switch (sortBy) {
          case "seeders":
            return b.seeders - a.seeders
          case "date":
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          case "size":
            // Convert sizes to comparable numbers (assuming format like "1.2 GB")
            const getSize = (size: string) => {
              const [num, unit] = size.split(" ")
              const multiplier = unit.toUpperCase() === "GB" ? 1000 : 1
              return parseFloat(num) * multiplier
            }
            return getSize(b.size) - getSize(a.size)
          default:
            return 0
        }
      })
  }, [results, sortBy, minSeeders])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for "{query}"
        </h1>
        
        {loading && (
          <div className="text-center py-8">Loading results...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="text-center py-8">No results found</div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <SearchFilters
                sortBy={sortBy}
                onSortChange={setSortBy}
                minSeeders={minSeeders}
                onMinSeedersChange={setMinSeeders}
              />
            </aside>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedResults.map((result, index) => (
                  <SearchResultCard
                    key={index}
                    {...result}
                    onDownload={() => handleDownload(result.magnet)}
                  />
                ))}
              </div>
              {filteredAndSortedResults.length === 0 && (
                <div className="text-center py-8">
                  No results match your filters
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
