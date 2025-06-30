import Link from "next/link"
import { Github, Twitter, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-white text-lg mb-4">StreamFlix</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Advanced streaming platform delivering high-quality content with cutting-edge technology and seamless user experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/movies" className="block text-gray-400 hover:text-white transition-colors">
                Movies
              </Link>
              <Link href="/tv-shows" className="block text-gray-400 hover:text-white transition-colors">
                TV Shows
              </Link>
              <Link href="/search" className="block text-gray-400 hover:text-white transition-colors">
                Search
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Status
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Report Issue
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} StreamFlix. Built with modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  )
}
