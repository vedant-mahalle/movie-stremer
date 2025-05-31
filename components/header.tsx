"use client"

import { useState, KeyboardEvent, ChangeEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
// import { AuthModal } from "@/components/auth-modal"
import { Search, Menu, X, Play } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
// import { getMagnetLink } from "@/lib/torrent-stream/getlink.mjs"
import { toast } from "sonner"

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a movie name")
      return
    }

    setIsSearching(true)
    try {
      // Redirect to search page with the query
      window.location.href = `/search?movie=${encodeURIComponent(searchQuery.trim())}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search movie';
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching) {
      console.log("Enter key pressed")
      handleSearch()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">StreamFlix</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/movies" className="text-sm font-medium hover:text-primary transition-colors">
            Movies
          </Link>
          <Link href="/tv-shows" className="text-sm font-medium hover:text-primary transition-colors">
            TV Shows
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Search movies, shows..." 
                  className="w-64" 
                  autoFocus
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                  disabled={isSearching}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)} 
              >
                <Search className="h-6 w-6" />
              </Button>
            )}
          </div>

          <ThemeToggle />


          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                  <Link href="/movies" className="text-lg font-medium">
                    Movies
                  </Link>
                  <Link href="/tv-shows" className="text-lg font-medium">
                    TV Shows
                  </Link>
                  <Link href="/my-list" className="text-lg font-medium">
                    My List
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

    </header>
  )
}