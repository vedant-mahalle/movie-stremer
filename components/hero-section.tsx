"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { fetchMoviesByCategory } from "@/lib/api"

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const heroMovies = await fetchMoviesByCategory('hero')
        setMovies(heroMovies)
      } catch (error) {
        console.error('Error loading hero movies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  useEffect(() => {
    if (movies.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [movies.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)
  }

  if (loading || movies.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </section>
    )
  }

  const currentMovie = movies[currentIndex]

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Background overlay for subtle effect */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Main content area: Flex container for left info and right image */}
      <div className="relative container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center">
        {/* Left side: Movie Information */}
        <div className="max-w-2xl md:w-1/2 space-y-6 text-center md:text-left z-10 p-4 md:p-0">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <Badge variant="secondary" className="bg-red-600 text-white hover:bg-red-700">
              Featured
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              {currentMovie.Year}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              {currentMovie.Genre?.split(', ')[0]}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {currentMovie.Title}
          </h1>

          <p className="text-lg text-gray-200 leading-relaxed line-clamp-3">
            {currentMovie.Plot}
          </p>

          <div className="flex items-center justify-center md:justify-start space-x-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              <Play className="mr-2 h-5 w-5" />
              Play Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-black hover:bg-white/10">
              <Plus className="mr-2 h-5 w-5" />
              My List
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hidden md:flex"> {/* Hide on smaller screens */}
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-300">
            <span>⭐ {currentMovie.imdbRating}/10</span>
            <span>{currentMovie.Runtime}</span>
            <span>{currentMovie.Rated}</span>
          </div>
        </div>

        {/* Right side: Movie Poster */}
        <div className="md:w-1/2 flex justify-center items-center p-4 z-10 mt-8 md:mt-0">
          <div className="relative w-64 h-96 md:w-80 md:h-[28rem] rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <Image
              src={currentMovie.Poster !== 'N/A' ? currentMovie.Poster : '/placeholder.jpg'}
              alt={currentMovie.Title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}