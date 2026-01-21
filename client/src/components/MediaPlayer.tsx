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

  const displayUrl = videoUrl || "/codesurfer.mp4";

  return (
    <div className="flex flex-col h-full bg-[#000000] text-white font-sans select-none overflow-hidden rounded-b-lg border border-[#353535]">
      {/* Video Area */}
      <div className="flex-1 bg-black relative group overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef}
          src={displayUrl} 
          className="w-full h-full object-contain"
          playsInline
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className="absolute top-2 left-3 text-white/50 text-[10px] pointer-events-none">
           Now Playing: {title}
        </div>
      </div>

      {/* Control Bar (Glossy WMP 11 style) */}
      <div className="bg-gradient-to-b from-[#353535] to-[#000000] p-3 flex flex-col gap-3 border-t border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        {/* Seeker Bar */}
        <div className="px-1 w-full relative h-1.5 bg-[#202020] rounded-full cursor-pointer group shadow-inner border border-white/5">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-[#00FF00] rounded-full shadow-[0_0_8px_#00FF00] transition-all duration-100" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between px-4 pb-1">
          {/* Controls Left */}
          <div className="flex items-center gap-5 text-gray-400">
            <button onClick={stopVideo} className="hover:text-white transition-colors">
              <Square className="w-5 h-5 fill-current" />
            </button>
            <button className="hover:text-white transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Large Main Play Button */}
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-[#4faeef] via-[#1c5fb0] to-[#00317d] flex items-center justify-center text-white border-2 border-white/30 shadow-[0_0_20px_rgba(28,95,176,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all relative after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-t after:from-transparent after:to-white/10"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current relative z-10" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1 relative z-10" />
            )}
          </button>

          {/* Controls Right / Volume */}
          <div className="flex items-center gap-5 text-gray-400">
            <button className="hover:text-white transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => setVolume(v => v === 0 ? 70 : 0)} className="hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-[#202020] rounded-full appearance-none cursor-pointer accent-[#4faeef] border border-white/5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
