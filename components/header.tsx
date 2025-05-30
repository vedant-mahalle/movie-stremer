"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthModal } from "@/components/auth-modal"
import { Search, Menu, X, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
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
          <Link href="/my-list" className="text-sm font-medium hover:text-primary transition-colors">
            My List
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center space-x-2">
                <Input placeholder="Search movies, shows..." className="w-64" autoFocus />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          <ThemeToggle />

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" onClick={() => openAuthModal("signin")}>
              Sign In
            </Button>
            <Button onClick={() => openAuthModal("signup")}>Sign Up</Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
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
                <div className="pt-4 border-t">
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" onClick={() => openAuthModal("signin")} className="justify-start">
                      Sign In
                    </Button>
                    <Button onClick={() => openAuthModal("signup")} className="justify-start">
                      Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  )
}
