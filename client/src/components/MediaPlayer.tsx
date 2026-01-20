import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface MediaPlayerProps {
  videoUrl?: string;
  title?: string;
}

export function MediaPlayer({ videoUrl, title }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
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
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  return (
    <div className="w-full border border-gray-400 rounded bg-[#ECE9D8] p-1 shadow-md">
      {/* Video Display Area */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border border-gray-500 mb-1">
        <video
          ref={videoRef}
          src={videoUrl || "/project_video.mp4"}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        />
        {(!videoUrl && !videoRef.current?.src) && (
          <div className="text-gray-600 text-xs text-center p-4">
            Windows Media Player<br/>
            (Insert Media)
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-1 mb-1">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="h-2 cursor-pointer"
        />
      </div>

      {/* Controls Bar - WMP9 Inspired */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-b from-[#F0F0F0] to-[#C0C0C0] border border-gray-400 rounded-sm">
        <div className="flex items-center gap-1">
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white border border-blue-800 shadow-sm hover:brightness-110 active:brightness-90 transition-all"
          >
            {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} className="ml-0.5" fill="white" />}
          </button>
          <button 
            onClick={stopVideo}
            className="w-6 h-6 rounded bg-[#ECE9D8] border border-gray-400 flex items-center justify-center text-gray-700 hover:bg-gray-200"
          >
            <Square size={12} fill="currentColor" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-blue-900 bg-white/50 px-2 py-0.5 border border-gray-300 rounded shadow-inner">
          {currentTime} / {duration}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="text-gray-700 hover:text-blue-700"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="w-16 h-1 bg-gray-300 rounded overflow-hidden border border-gray-400">
             <div className={`h-full bg-blue-500 ${isMuted ? 'opacity-30' : ''}`} style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
