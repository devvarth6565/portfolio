import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: string, title?: string) => void;
}

export function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Only close if we didn't click the start button itself (handled by Taskbar)
        const startButton = document.querySelector('[data-testid="button-start-toggle"]');
        if (startButton && startButton.contains(event.target as Node)) {
          return;
        }
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={menuRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed bottom-[30px] left-0 w-[380px] bg-[#245EDC] rounded-t-lg shadow-2xl z-[1000] border-t border-l border-r border-[#1c5fb0] overflow-hidden flex flex-col font-['Tahoma',sans-serif]"
    >
      {/* Header */}
      <div className="h-[60px] bg-gradient-to-r from-[#1c5fb0] to-[#4faeef] p-2 flex items-center gap-3 border-b border-[#00317d]">
        <div className="w-12 h-12 rounded border-2 border-white overflow-hidden bg-white">
          <img 
            src="/profile.jpg" 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://win98icons.alexmeub.com/icons/png/computer_user_pencil-0.png';
            }}
          />
        </div>
        <span className="text-white font-bold text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
          Administrator
        </span>
      </div>

      {/* Body */}
      <div className="flex bg-[#D3E5FA] p-[1px] gap-[1px]">
        {/* Left Column (Programs) */}
        <div className="flex-1 bg-white p-2 flex flex-col gap-1 min-h-[350px]">
          <button 
            className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left group"
            onClick={() => window.open('https://github.com/devvarthsingh', '_blank')}
          >
            <img src="https://win98icons.alexmeub.com/icons/png/msie1-2.png" className="w-8 h-8" alt="IE" />
            <div className="flex flex-col">
              <span className="font-bold">Internet Explorer</span>
            </div>
          </button>
          
          <button 
            className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left"
            onClick={() => window.location.href = 'mailto:contact@example.com'}
          >
            <span className="w-8 h-8 flex items-center justify-center text-xl">📧</span>
            <div className="flex flex-col">
              <span className="font-bold">Outlook Express</span>
            </div>
          </button>

          <button 
            className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left"
            onClick={() => onOpenWindow('computer')}
          >
            <span className="w-8 h-8 flex items-center justify-center text-xl">📄</span>
            <div className="flex flex-col">
              <span className="font-bold">Resume</span>
            </div>
          </button>

          <div className="mt-auto pt-2 border-t border-gray-300">
            <button className="w-full flex items-center justify-between p-2 hover:bg-[#2F71CD] hover:text-white rounded text-xs font-bold">
              <span>All Programs</span>
              <span className="text-[#F6A300]">►</span>
            </button>
          </div>
        </div>

        {/* Right Column (System) */}
        <div className="w-[160px] bg-[#D3E5FA] p-2 flex flex-col gap-2 text-[#001358]">
          <button 
            className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left font-bold"
            onClick={() => { onOpenWindow('documents'); onClose(); }}
          >
            <span className="text-lg">📂</span>
            <span>My Documents</span>
          </button>
          <button className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left font-bold opacity-60">
            <span className="text-lg">📁</span>
            <span>My Recent Documents</span>
          </button>
          <button className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left font-bold opacity-60">
            <span className="text-lg">🖼️</span>
            <span>My Pictures</span>
          </button>
          <button className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left font-bold opacity-60">
            <span className="text-lg">🎵</span>
            <span>My Music</span>
          </button>
          
          <div className="my-1 border-t border-[#91B0DF]" />
          
          <button className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left font-bold opacity-60">
            <span className="text-lg">🛠️</span>
            <span>Control Panel</span>
          </button>
          
          <button 
            className="flex items-center gap-2 p-1 hover:bg-[#2F71CD] hover:text-white rounded text-xs text-left font-bold mt-4"
            onClick={() => {
              const cmd = prompt("Type a command:");
              if (cmd) alert(`Running: ${cmd} (Easter Egg!)`);
            }}
          >
            <span className="text-lg">🏃</span>
            <span>Run...</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[45px] bg-gradient-to-r from-[#1c5fb0] to-[#4faeef] p-2 flex items-center justify-end gap-4 border-t border-[#00317d]">
        <button 
          className="flex items-center gap-1 text-white text-xs hover:brightness-110"
          onClick={() => alert("Logging off...")}
        >
          <div className="bg-[#F6A300] w-5 h-5 flex items-center justify-center rounded">🔑</div>
          <span>Log Off</span>
        </button>
        <button 
          className="flex items-center gap-1 text-white text-xs hover:brightness-110"
          onClick={() => {
            document.body.style.filter = 'grayscale(100%)';
            setTimeout(() => {
              if (confirm("Shutting down... (Simulated). Refresh to restore.")) {
                window.location.reload();
              } else {
                document.body.style.filter = '';
              }
            }, 1000);
          }}
        >
          <div className="bg-[#E21E22] w-5 h-5 flex items-center justify-center rounded text-white font-bold">I</div>
          <span>Turn Off Computer</span>
        </button>
      </div>
    </motion.div>
  );
}
