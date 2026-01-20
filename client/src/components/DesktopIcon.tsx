import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
  selected?: boolean;
  onClick?: () => void;
}

export function DesktopIcon({ label, icon, onDoubleClick, selected, onClick }: DesktopIconProps) {
  return (
    <div 
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
    >
      <div className="w-[48px] h-[48px] flex items-center justify-center drop-shadow-md">
        {icon}
      </div>
      <span className="desktop-icon-text">{label}</span>
    </div>
  );
}
