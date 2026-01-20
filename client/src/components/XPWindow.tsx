import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { X, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  icon?: string;
  defaultPosition?: { x: number; y: number };
}

export function XPWindow({ 
  id, 
  title, 
  isOpen, 
  minimized, 
  onClose, 
  onMinimize, 
  onClick, 
  isActive, 
  children,
  icon,
  defaultPosition = { x: 50, y: 50 }
}: XPWindowProps) {
  const nodeRef = useRef(null);

  if (!isOpen) return null;

  return (
    <Draggable
      handle=".xp-window-header"
      nodeRef={nodeRef}
      defaultPosition={defaultPosition}
      onStart={onClick}
    >
      <div 
        ref={nodeRef}
        className={`xp-window ${minimized ? 'invisible pointer-events-none' : ''}`}
        style={{ 
          zIndex: isActive ? 40 : 10,
          width: 'min(800px, 90vw)',
          height: 'min(600px, 80vh)'
        }}
        onClick={onClick}
      >
        {/* Header */}
        <div className={`xp-window-header ${isActive ? '' : 'grayscale opacity-90'}`}>
          <div className="flex items-center gap-2 pointer-events-none">
            {icon && <img src={icon} alt="icon" className="w-4 h-4" />}
            <span className="font-bold text-shadow-sm select-none truncate max-w-[200px]">{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
             <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-[21px] h-[21px] bg-[#225AD8] border border-white/60 rounded-[3px] flex items-center justify-center hover:brightness-110 active:brightness-90 shadow-sm group"
             >
                <Minus className="w-3 h-3 text-white stroke-[3]" />
             </button>
             <button 
              className="w-[21px] h-[21px] bg-[#225AD8] border border-white/60 rounded-[3px] flex items-center justify-center hover:brightness-110 active:brightness-90 shadow-sm group"
             >
                <Maximize2 className="w-3 h-3 text-white stroke-[3]" />
             </button>
             <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-[21px] h-[21px] bg-[#D6442D] border border-white/60 rounded-[3px] flex items-center justify-center hover:brightness-110 active:brightness-90 shadow-sm ml-0.5 group"
             >
                <X className="w-3 h-3 text-white stroke-[3]" />
             </button>
          </div>
        </div>

        {/* Menu Bar (Standard XP) */}
        <div className="bg-[#ECE9D8] px-1 py-0.5 border-b border-[#D1CAB0] flex items-center gap-2 text-xs select-none">
           <span className="hover:bg-[#1660E8] hover:text-white px-2 py-0.5 cursor-default">File</span>
           <span className="hover:bg-[#1660E8] hover:text-white px-2 py-0.5 cursor-default">Edit</span>
           <span className="hover:bg-[#1660E8] hover:text-white px-2 py-0.5 cursor-default">View</span>
           <span className="hover:bg-[#1660E8] hover:text-white px-2 py-0.5 cursor-default">Favorites</span>
           <span className="hover:bg-[#1660E8] hover:text-white px-2 py-0.5 cursor-default">Tools</span>
           <span className="hover:bg-[#1660E8] hover:text-white px-2 py-0.5 cursor-default">Help</span>
        </div>

        {/* Toolbar (Simplified) */}
        <div className="bg-[#ECE9D8] px-2 py-1 border-b border-[#D1CAB0] flex items-center gap-2 select-none">
           <div className="flex items-center gap-1 opacity-50">
             <div className="p-1 rounded-full border border-gray-400 bg-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/></svg>
             </div>
             <span className="text-xs">Back</span>
           </div>
           <div className="w-[1px] h-[24px] bg-gray-400 mx-1"></div>
           <div className="bg-white border border-[#7F9DB9] px-2 py-0.5 w-[300px] text-sm text-gray-600 truncate flex items-center gap-2">
             <img src={icon} className="w-4 h-4 grayscale opacity-70" alt="" />
             Address <span className="text-black">{id === 'computer' ? 'My Computer' : `C:\\Documents and Settings\\User\\My Documents\\${title}`}</span>
           </div>
        </div>

        {/* Content */}
        <div className="xp-window-content">
          {children}
        </div>

        {/* Status Bar */}
        <div className="h-[22px] bg-[#ECE9D8] border-t border-[#D1CAB0] flex items-center px-2 text-xs text-gray-600 select-none">
           <span>1 object(s) selected</span>
        </div>
      </div>
    </Draggable>
  );
}
