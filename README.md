# 🎬 StreamFlix

> **Your Ultimate Streaming Platform**

StreamFlix is a modern, full-stack streaming platform that lets you discover, search, and stream movies and TV shows in HD quality. Enjoy trending content, create your watchlist, and experience seamless streaming—all in a beautiful, responsive UI.

---

## 🌟 Features

- **Browse & Discover:** Trending, new releases, and popular movies and TV shows.
- **Advanced Search:** Find movies and shows by name, genre, or year.
- **Magnet Streaming:** Stream directly from magnet links using WebTorrent technology.
- **Dynamic Filters:** Refine results by genre, year, and more.
- **Responsive UI:** Optimized for all devices with light/dark mode.
- **Test Streaming:** Built-in page to test your streaming setup.
- **Modern Design:** Smooth animations, gradients, and a polished look.

---

## 🖼️ Screenshots

> _Paste your screenshots below to showcase the app!_

## Working
https://github.com/user-attachments/assets/d6d9d2f5-0b1a-4b2c-937f-4ac66ea5e723


---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend:** Next.js API routes, WebTorrent, PirateBay Scraper, OMDb API, Trakt API
- **UI Components:** Radix UI, shadcn/ui, Lucide Icons
- **Styling:** Tailwind CSS, CSS Variables, Dark/Light Theme
- **Other:** TypeScript, Zod, Sonner (toasts), Embla Carousel

---

## 🚀 Getting Started

### 1. **Clone the repository**
```bash
git clone <your-repo-url>
cd movie-stremer
```

### 2. **Install dependencies**
You can use **npm** or **pnpm**:
```bash
npm install
# or
pnpm install
```

### 3. **Set up environment variables**
Create a `.env.local` file in the root and add your API keys:
```env
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_key
TRAKT_CLIENT_ID=your_trakt_client_id
TMDB_API_KEY=your_tmdb_key
```

### 4. **Run the development server**
```bash
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📚 API Overview

### **/api/search**
- **GET**: Search for movies/tv shows via PirateBay and OMDb.
- Params: `movie` (string)

### **/api/stream**
- **POST**: Start a new stream from a magnet link.
- **GET**: List active streams.

### **/api/stream/[id]**
- **GET**: Get stream info.
- **DELETE**: Stop and clean up a stream.

### **/api/stream/[id]/status**
- **GET**: Get status and progress of a stream.

### **/api/stream/[id]/video**
- **GET**: Stream the video file (supports range requests).

### **/api/omdb**
- **GET**: Proxy to OMDb API for movie info.

### **/api/trakt**
- **GET**: Proxy to Trakt API for trending/popular/new movies.

### **/api/magnet**
- **POST**: Get a magnet link for a movie name via PirateBay.

### **/api/health**
- **GET**: Health check for the server and active streams.

---

## 🧩 Folder Structure

```
app/           # Next.js app directory (pages, API routes)
components/    # UI components (header, footer, cards, etc.)
hooks/         # Custom React hooks
lib/           # API utilities, helpers, streaming logic
public/        # Static assets and test pages
styles/        # Global styles (Tailwind)
```

---

## 💡 Credits

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WebTorrent](https://webtorrent.io/)
- [PirateBay Scraper](https://www.npmjs.com/package/piratebay-scraper)
- [OMDb API](https://www.omdbapi.com/)
- [Trakt API](https://trakt.docs.apiary.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📄 License

This project is for educational purposes only. Please respect copyright laws in your country. 
