import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">StreamFlix</h3>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for movies and TV shows. Stream unlimited content in HD quality.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Navigation</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/movies" className="block text-muted-foreground hover:text-foreground transition-colors">
                Movies
              </Link>
              <Link href="/tv-shows" className="block text-muted-foreground hover:text-foreground transition-colors">
                TV Shows
              </Link>
              <Link href="/my-list" className="block text-muted-foreground hover:text-foreground transition-colors">
                My List
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Connect</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Facebook
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                YouTube
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
