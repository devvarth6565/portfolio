import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Monitor, Volume2, Wifi } from 'lucide-react';

interface TaskbarProps {
  openWindows: Array<{ id: string; title: string; minimized: boolean }>;
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
}

export function Taskbar({ openWindows, activeWindowId, onWindowClick, onStartClick }: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="taskbar select-none">
      {/* Start Button */}
      <div 
        className="start-button group"
        onClick={onStartClick}
        data-testid="button-start-toggle"
      >
        <div className="italic font-bold text-white text-lg flex items-center gap-1.5 drop-shadow-md">
           <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 3.5L10 2.2V11.3H0V3.5Z" fill="#F25022"/>
             <path d="M11.5 2L22.5 0.5V11.3H11.5V2Z" fill="#7FBA00"/>
             <path d="M0 12.6H10V21.7L0 20.3V12.6Z" fill="#00A4EF"/>
             <path d="M11.5 12.6H22.5V23.4L11.5 21.8V12.6Z" fill="#FFB900"/>
           </svg>
           <span className="mt-0.5" style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>start</span>
        </div>
      </div>

      {/* Separator */}
      <div className="w-[2px] h-[80%] bg-[#153488] border-r border-[#3864CD] opacity-60 mx-1"></div>

      {/* Task Items */}
      <div className="flex-1 flex items-center overflow-hidden pr-2">
        {openWindows.map((window) => (
          <div
            key={window.id}
            className={`taskbar-item ${activeWindowId === window.id && !window.minimized ? 'active' : ''}`}
            onClick={() => onWindowClick(window.id)}
          >
             <img src={window.id === 'computer' ? "https://cdn-icons-png.flaticon.com/512/2889/2889279.png" : "https://cdn-icons-png.flaticon.com/512/3767/3767084.png"} alt="icon" className="w-4 h-4" />
             <span className="truncate">{window.title}</span>
          </div>
        ))}
      </div>

      {/* System Tray */}
      <div className="h-full bg-[#0B77E9] border-l border-[#133C94] px-3 flex items-center gap-3 shadow-inner">
         <div className="flex items-center gap-2 text-white/80">
            <Volume2 className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Monitor className="w-3.5 h-3.5 hidden sm:block" />
         </div>
         <span className="text-white text-xs font-normal" style={{ textShadow: "none" }}>
            {format(time, 'h:mm a')}
         </span>
      </div>
    </div>
  );
}
