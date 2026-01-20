import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface MediaPlayerProps {
  videoUrl?: string | null;
  title: string;
}

export function MediaPlayer({ videoUrl, title }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(70);

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

  const displayUrl = videoUrl || "/project_video.mp4";

  return (
    <div className="bg-[#B6BCCC] border border-[#6B7484] p-1 shadow-md w-full max-w-[600px] mx-auto flex flex-col font-sans select-none">
      {/* Title Bar */}
      <div className="bg-[#2D60A8] text-white text-[11px] px-2 py-1 flex justify-between items-center mb-1 font-bold">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded-sm flex items-center justify-center border border-blue-300">
            <div className="w-1.5 h-1.5 bg-white"></div>
          </div>
          <span>Windows Media Player</span>
        </div>
        <div className="flex gap-0.5">
          <div className="w-4 h-4 rounded-sm bg-[#3A6BC5] border border-[#1E4A9E] flex items-center justify-center text-[10px] shadow-sm cursor-pointer hover:bg-[#4E7FD9]">_</div>
          <div className="w-4 h-4 rounded-sm bg-[#3A6BC5] border border-[#1E4A9E] flex items-center justify-center text-[10px] shadow-sm cursor-pointer hover:bg-[#4E7FD9]">□</div>
          <div className="w-4 h-4 rounded-sm bg-[#C94D3C] border border-[#8B3529] flex items-center justify-center text-[10px] shadow-sm cursor-pointer hover:bg-[#E55D4B]">X</div>
        </div>
      </div>

      {/* Screen Area */}
      <div className="bg-black aspect-video w-full mb-1 relative border-2 border-[#545D6D] shadow-inner group overflow-hidden">
        <video 
           ref={videoRef}
           src={displayUrl} 
           className="w-full h-full object-contain"
           onTimeUpdate={handleTimeUpdate}
           onLoadedMetadata={handleLoadedMetadata}
           onClick={togglePlay}
        />
        <div className="absolute top-2 left-2 text-white/70 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
           {title} - Windows Media Player
        </div>
      </div>

      {/* Seek Bar */}
      <div className="px-1 mb-1 bg-[#8692A7]/20 py-1">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="h-1.5 cursor-pointer"
        />
      </div>

      {/* Controls Area */}
      <div className="bg-gradient-to-b from-[#E3E7F0] to-[#C0C7D8] p-1.5 border-t border-white flex items-center justify-between gap-4 rounded-b-sm shadow-inner">
         <div className="flex items-center gap-1.5">
           <button 
             onClick={togglePlay}
             className="w-9 h-9 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 flex items-center justify-center text-white border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 transition-all"
           >
             {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
           </button>
           <button 
             onClick={stopVideo}
             className="w-6 h-6 rounded bg-gradient-to-b from-[#E3E7F0] to-[#C0C7D8] border border-gray-500 flex items-center justify-center text-gray-700 shadow-sm hover:brightness-105 active:translate-y-[1px]"
           >
             <Square className="w-3 h-3 fill-gray-500" />
           </button>
         </div>

         {/* Time and Playlist Display */}
         <div className="flex-1 bg-black/80 rounded border border-white/20 px-2 py-1 flex justify-between items-center text-[10px] font-mono text-blue-400 shadow-inner">
           <span>{currentTime}</span>
           <span className="text-white/40">/</span>
           <span>{duration}</span>
         </div>

         <div className="flex items-center gap-2">
           <button 
             onClick={toggleMute}
             className="text-gray-700 hover:text-blue-700 transition-colors"
           >
             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
           </button>
           <div className="w-16 h-1.5 bg-[#8692A7] rounded-full overflow-hidden border border-gray-500 shadow-inner relative group cursor-pointer">
              <div 
                className={`h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all ${isMuted ? 'opacity-30' : ''}`} 
                style={{ width: `${volume}%` }}
              ></div>
           </div>
           <button className="text-gray-700 hover:text-blue-700 transition-colors">
             <Maximize2 className="w-4 h-4" />
           </button>
         </div>
      </div>
    </div>
  );
}
