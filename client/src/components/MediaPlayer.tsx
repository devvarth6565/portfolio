import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface MediaPlayerProps {
  videoUrl?: string | null;
  title: string;
}

export function MediaPlayer({ videoUrl, title }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, retry muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
        }
      });
    }
  }, []);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol / 100;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const displayUrl = videoUrl || "/codesurfer.mov";

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-sans select-none overflow-hidden rounded-b-lg">
      {/* Visualization / Video Area */}
      <div className="flex-1 bg-black relative group overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef}
          src={displayUrl} 
          className="w-full h-full object-contain"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Control Bar */}
      <div className="bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] p-2 flex flex-col gap-2 border-t border-white/10 shadow-2xl">
        {/* Seeker Bar */}
        <div className="px-2 w-full relative h-1 bg-gray-700 rounded-full cursor-pointer group">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-[#00FF00] rounded-full shadow-[0_0_5px_#00FF00]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between px-4 pb-1">
          {/* Secondary Left */}
          <div className="flex items-center gap-4 text-gray-400">
            <button onClick={stopVideo} className="hover:text-white transition-colors">
              <Square className="w-4 h-4 fill-current" />
            </button>
            <button className="hover:text-white transition-colors">
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Main Play Button */}
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center text-white border-2 border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          {/* Secondary Right / Volume */}
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-white transition-colors">
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
            <div className="flex items-center gap-2 group">
              <Volume2 className="w-4 h-4" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
