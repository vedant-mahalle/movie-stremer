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
        if (data.status === 'ready' && !videoUrl) {
          const videoFile = data.files.find((file: any) => 
            isVideoFile(file.name) && file.streamable
          );
          
          if (videoFile) {
            const url = `/api/stream/${streamId}/video?file=${encodeURIComponent(videoFile.name)}`;
            setVideoUrl(url);
            console.log("✅ Video URL created:", url);
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
  }, [streamId, videoUrl]);

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
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[70vh]"
              controls
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Progress and Stats */}
          {streamStatus && (
            <div className="bg-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Download Progress</span>
                <span className="text-sm text-muted-foreground">{streamStatus.progress}%</span>
              </div>
              <Progress value={streamStatus.progress} className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Download Speed:</span>
                  <span className="font-medium">{formatBytes(streamStatus.downloadSpeed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upload Speed:</span>
                  <span className="font-medium">{formatBytes(streamStatus.uploadSpeed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Peers:</span>
                  <span className="font-medium">{streamStatus.peers}</span>
                </div>
              </div>

              {streamStatus.files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Files:</h4>
                  <div className="space-y-1">
                    {streamStatus.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="truncate">{file.name}</span>
                        <span className="text-muted-foreground">
                          {isVideoFile(file.name) && file.streamable ? '✅' : '⏳'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Controls */}
          <div className="bg-card p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button onClick={togglePlayPause} size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={toggleMute} size="sm" variant="outline">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
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