"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieFilters } from "@/components/movie-filters"
import { MovieGridDynamic } from "@/components/movie-grid-dynamic"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Movies</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <MovieFilters 
                onGenreChange={setSelectedGenre}
                onYearChange={setSelectedYear}
              />
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Movies</h1>
              </div>
              <MovieGridDynamic 
                genre={selectedGenre}
                year={selectedYear}
                searchQuery={selectedGenre || "popular"}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
