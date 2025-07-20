"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMovieById, type MovieDetails } from "@/lib/omdb";
import Image from "next/image";

interface StreamStatus {
  id: string;
  status: 'starting' | 'downloading' | 'ready' | 'error' | 'completed';
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  peers: number;
  files: Array<{
    name: string;
    length: number;
    path: string;
    streamable: boolean;
  }>;
  error?: string;
  createdAt: string;
}

export default function StreamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const streamId = params.id as string;
  const title = searchParams.get('title') || 'Unknown Title';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [backLoading, setBackLoading] = useState(false);
  const [movieInfo, setMovieInfo] = useState<MovieDetails | null>(null);

  // Poll stream status
  useEffect(() => {
    if (!streamId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/stream/${streamId}/status`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get stream status');
        }

        setStreamStatus(data);
        setLoading(false);

        // If stream is ready and we don't have a video URL yet
        if (data.status === 'ready' && !selectedFile) {
          const videoFile = data.files.find((file: any) => 
            isVideoFile(file.name) && file.streamable
          );
          if (videoFile) {
            setSelectedFile(videoFile.name);
          }
        }

        // If stream has error
        if (data.status === 'error') {
          setError(data.error || 'Stream error occurred');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error polling stream status:', err);
        setError(err instanceof Error ? err.message : 'Failed to get stream status');
        setLoading(false);
      }
    };

    // Initial poll
    pollStatus();

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [streamId, selectedFile]);

  // Update videoUrl when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      setVideoUrl(`/api/stream/${streamId}/video?file=${encodeURIComponent(selectedFile)}`);
    }
  }, [selectedFile, streamId]);

  // Set up video element
  useEffect(() => {
    if (videoUrl && videoRef.current && videoRef.current.src !== videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();
      
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          setDuration(videoRef.current.duration);
        }
      };

      videoRef.current.onplay = () => setIsPlaying(true);
      videoRef.current.onpause = () => setIsPlaying(false);
      videoRef.current.onended = () => setIsPlaying(false);
    }
  }, [videoUrl]);

  // Fetch movie info by title, then by imdbID for full details
  useEffect(() => {
    async function fetchMovieInfo() {
      if (!title || title === 'Unknown Title') return;
      try {
        // First, search by title
        const res = await fetch(`/api/omdb?q=${encodeURIComponent(title)}`);
        const data = await res.json();
        let imdbID = null;
        if (data && data.Response === 'True') {
          const first = data.Search && data.Search.length > 0 ? data.Search[0] : data;
          imdbID = first.imdbID;
        }
        // If we have an imdbID, fetch full details
        if (imdbID) {
          const detailRes = await fetch(`/api/omdb?id=${imdbID}`);
          const detailData = await detailRes.json();
          if (detailData && detailData.Response === 'True') {
            setMovieInfo(detailData);
            return;
          }
        }
        // Fallback: set first result
        if (data && data.Response === 'True') {
          setMovieInfo(data.Search && data.Search.length > 0 ? data.Search[0] : data);
        }
      } catch (e) {
        setMovieInfo(null);
      }
    }
    fetchMovieInfo();
  }, [title]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const retryStream = () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStreamStatus(null);
  };

  // Handler for Back to Search
  const handleBackToSearch = async () => {
    setBackLoading(true);
    try {
      await fetch(`/api/stream/${streamId}`, { method: 'DELETE' });
    } catch (e) {
      // Optionally show a toast or log error
    } finally {
      setBackLoading(false);
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg">Starting stream...</p>
            {streamStatus && (
              <div className="w-full max-w-md mt-4">
                <Progress value={streamStatus.progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {streamStatus.status === 'starting' && 'Connecting to torrent...'}
                  {streamStatus.status === 'downloading' && `Downloading: ${streamStatus.progress}%`}
                  {streamStatus.status === 'ready' && 'Video ready to play!'}
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <div className="flex space-x-4">
              <Button onClick={retryStream}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (YouTube style) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
            <video
              ref={videoRef}
                className="w-full h-full object-contain bg-black"
              controls
              onTimeUpdate={handleTimeUpdate}
                key={videoUrl || undefined}
                style={{ background: 'black' }}
            />
          </div>
            {/* Title and Controls */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h1 className="text-2xl font-bold line-clamp-2">{movieInfo?.Title || title} <span className="text-lg font-normal text-muted-foreground">{movieInfo?.Year ? `(${movieInfo.Year})` : ''}</span></h1>
                <div className="flex flex-wrap gap-2 items-center mt-2 md:mt-0">
                  {movieInfo?.imdbRating && movieInfo.imdbRating !== 'N/A' && (
                    <Badge variant="default">IMDb {movieInfo.imdbRating}</Badge>
                  )}
                  {movieInfo?.Runtime && <Badge variant="secondary">{movieInfo.Runtime}</Badge>}
                  {movieInfo?.Rated && <Badge variant="secondary">{movieInfo.Rated}</Badge>}
                  {streamStatus && <Badge variant={streamStatus.status === 'ready' ? 'default' : 'secondary'}>{streamStatus.status === 'ready' ? 'Ready' : streamStatus.status}</Badge>}
                </div>
              </div>
          {/* Video Controls */}
              <div className="flex items-center gap-4 mt-2">
                <Button onClick={togglePlayPause} size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={toggleMute} size="sm" variant="outline">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              <div className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="ml-auto">
                  <Button variant="outline" onClick={handleBackToSearch} disabled={backLoading}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {backLoading ? 'Stopping...' : 'Back to Search'}
                  </Button>
                </div>
              </div>
            </div>
            {/* File/Episode Selector */}
            {streamStatus && streamStatus.files.length > 1 && (
              <div className="w-full mt-2">
                <label htmlFor="file-select" className="block text-xs font-medium mb-1 text-muted-foreground">
                  {`Select ${streamStatus.files.length > 1 ? 'Episode' : 'File'}:`}
                </label>
                <select
                  id="file-select"
                  className="w-full p-2 border rounded bg-background"
                  value={selectedFile || ''}
                  onChange={e => setSelectedFile(e.target.value)}
                >
                  {streamStatus.files.filter((file: any) => isVideoFile(file.name) && file.streamable).map((file: any, idx: number) => (
                    <option key={file.name} value={file.name}>
                      {`Episode ${idx + 1}: ${file.name}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Movie Metadata Card */}
            <Card className="mt-4">
              <CardContent className="pt-4">
                {movieInfo ? (
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground mb-2">{movieInfo.Genre}</div>
                      <div className="text-sm mb-2"><span className="font-semibold">Director:</span> {movieInfo.Director}</div>
                      <div className="text-sm mb-2"><span className="font-semibold">Actors:</span> {movieInfo.Actors}</div>
                      <div className="text-sm mb-2"><span className="font-semibold">Plot:</span> {movieInfo.Plot}</div>
                      <div className="text-xs text-muted-foreground mt-2"><span>Released: {movieInfo.Released}</span></div>
                    </div>
                    {/* Right: Poster */}
                    {movieInfo.Poster && movieInfo.Poster !== 'N/A' && (
                      <div className="flex-shrink-0 flex items-start h-full">
                        <Image
                          src={movieInfo.Poster}
                          alt={movieInfo.Title}
                          width={100}
                          height={150}
                          className="rounded-lg shadow-lg object-contain bg-black w-[80px] h-[120px] md:w-[100px] md:h-[150px] lg:w-[120px] lg:h-[180px] xl:w-[140px] xl:h-[210px]"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <span>Loading movie info...</span>
                )}
              </CardContent>
            </Card>
            {/* Stream Info Card */}
            <Card className="mt-4">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-base font-semibold">Stream Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {streamStatus && (
                  <>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Download Progress</span>
                        <Badge variant="secondary">{streamStatus.progress}%</Badge>
                      </div>
                      <Progress value={streamStatus.progress} className="mb-2" />
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Download Speed:</span>
                        <Badge variant="outline">{formatBytes(streamStatus.downloadSpeed)}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Upload Speed:</span>
                        <Badge variant="outline">{formatBytes(streamStatus.uploadSpeed)}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Peers:</span>
                        <Badge variant="outline">{streamStatus.peers}</Badge>
                      </div>
                    </div>
                    {streamStatus.files.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Files</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                          {streamStatus.files
                            .filter((file: { name: string }) => file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.webm'))
                            .map((file: any) => (
                              <div key={file.name} className="flex items-center justify-between text-xs">
                                <span className="truncate">{file.name}</span>
                                <Badge variant={file.streamable ? 'default' : 'secondary'}>
                                  {file.streamable ? 'Ready' : 'Pending'}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Sidebar (Poster, sticky) */}
          <aside className="hidden lg:block col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              {movieInfo?.Poster && movieInfo.Poster !== 'N/A' && (
                <Card className="overflow-hidden">
                  <div className="w-full flex justify-center p-4">
                    <Image
                      src={movieInfo.Poster}
                      alt={movieInfo.Title}
                      width={260}
                      height={390}
                      className="rounded-lg shadow-lg object-cover"
                    />
                  </div>
                </Card>
              )}
              {/* Up Next or Related Movies can go here in the future */}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function isVideoFile(filename: string): boolean {
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp'];
  const ext = filename.toLowerCase().split('.').pop();
  return videoExtensions.includes(`.${ext}`);
} 