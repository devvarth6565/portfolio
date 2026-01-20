import { Play, Pause, Square, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useState } from "react";

interface MediaPlayerProps {
  videoUrl?: string | null;
  title: string;
}

export function MediaPlayer({ videoUrl, title }: MediaPlayerProps) {
  const [playing, setPlaying] = useState(false);

  // Fallback to a placeholder if no URL provided (simulated)
  const displayUrl = videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

  return (
    <div className="bg-[#B6BCCC] border border-[#6B7484] p-1 shadow-md w-full max-w-[500px] mx-auto">
      {/* Title Bar */}
      <div className="bg-[#2D60A8] text-white text-xs px-2 py-0.5 flex justify-between items-center mb-1">
        <span>Windows Media Player</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
        </div>
      </div>

      {/* Screen */}
      <div className="bg-black aspect-video w-full mb-1 relative border-2 border-[#545D6D] shadow-inner">
        <video 
           src={displayUrl} 
           className="w-full h-full object-contain"
           controls={false}
           autoPlay={false} // Don't autoplay to avoid noise
        />
        <div className="absolute bottom-2 left-2 text-white text-xs drop-shadow-md">
           {title} - Now Playing
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-b from-[#E3E7F0] to-[#C0C7D8] p-2 border-t border-white flex items-center justify-between">
         <div className="flex gap-1">
           <button className="p-1.5 rounded-full hover:bg-white/50 active:translate-y-[1px] shadow-sm border border-gray-400">
             <SkipBack className="w-3 h-3 fill-current text-[#1A3866]" />
           </button>
           <button 
             className="p-2 rounded-full bg-gradient-to-b from-white to-[#D2D8E3] active:translate-y-[1px] shadow border border-gray-400"
             onClick={() => setPlaying(!playing)}
           >
             {playing ? <Pause className="w-4 h-4 fill-current text-[#1A3866]" /> : <Play className="w-4 h-4 fill-current text-[#1A3866] ml-0.5" />}
           </button>
           <button className="p-1.5 rounded-full hover:bg-white/50 active:translate-y-[1px] shadow-sm border border-gray-400">
             <Square className="w-3 h-3 fill-current text-[#1A3866]" />
           </button>
           <button className="p-1.5 rounded-full hover:bg-white/50 active:translate-y-[1px] shadow-sm border border-gray-400">
             <SkipForward className="w-3 h-3 fill-current text-[#1A3866]" />
           </button>
         </div>

         {/* Volume / Seek */}
         <div className="flex items-center gap-2 flex-1 ml-4">
            <div className="h-1 bg-[#8692A7] flex-1 rounded-full shadow-inner relative">
               <div className="absolute left-0 top-0 h-full w-[30%] bg-[#3D8526] rounded-l-full"></div>
               <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-2 h-3 bg-[#E3E7F0] border border-gray-500 rounded-sm shadow"></div>
            </div>
            <Volume2 className="w-4 h-4 text-[#545D6D]" />
         </div>
      </div>
    </div>
  );
}
