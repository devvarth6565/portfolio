import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SidebarSectionProps {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

function SidebarSection({ title, isOpen = true, children }: SidebarSectionProps) {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="mb-3">
      <div 
        className="bg-gradient-to-r from-white to-[#C4D3F8] rounded-t-[3px] px-3 py-1 cursor-pointer flex justify-between items-center group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold text-[#215DC6] text-[11px] group-hover:text-[#428EFF]">{title}</span>
        <div className="w-[18px] h-[18px] bg-white border border-[#C4D3F8] rounded-full flex items-center justify-center shadow-sm">
          {open ? <ChevronUp className="w-3 h-3 text-[#215DC6]" /> : <ChevronDown className="w-3 h-3 text-[#215DC6]" />}
        </div>
      </div>
      {open && (
        <div className="bg-[#D6DFF7] p-2 border-x border-b border-white">
          {children}
        </div>
      )}
    </div>
  );
}

export function SystemSidebar() {
  return (
    <div className="w-[200px] bg-[#7BA2E7] p-3 h-full overflow-y-auto hidden md:block select-none" style={{ backgroundImage: 'linear-gradient(to bottom, #7BA2E7 0%, #6375D6 100%)' }}>
      <SidebarSection title="System Tasks">
        <div className="flex flex-col gap-1 text-[11px] text-[#215DC6]">
          <a href="#" className="flex items-center gap-2 hover:underline hover:text-[#428EFF]">
            <img src="https://cdn-icons-png.flaticon.com/512/6821/6821002.png" className="w-4 h-4" alt="sys" />
            View system information
          </a>
          <a href="#" className="flex items-center gap-2 hover:underline hover:text-[#428EFF]">
            <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" className="w-4 h-4" alt="add" />
            Add or remove programs
          </a>
          <a href="#" className="flex items-center gap-2 hover:underline hover:text-[#428EFF]">
            <img src="https://cdn-icons-png.flaticon.com/512/3524/3524659.png" className="w-4 h-4" alt="change" />
            Change a setting
          </a>
        </div>
      </SidebarSection>

      <SidebarSection title="Other Places">
        <div className="flex flex-col gap-1 text-[11px] text-[#215DC6]">
           <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" className="w-4 h-4" alt="docs" />
              My Documents
           </div>
           <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="https://cdn-icons-png.flaticon.com/512/3014/3014775.png" className="w-4 h-4" alt="shared" />
              Shared Documents
           </div>
           <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="https://cdn-icons-png.flaticon.com/512/2889/2889279.png" className="w-4 h-4" alt="comp" />
              My Computer
           </div>
           <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="https://cdn-icons-png.flaticon.com/512/2228/2228076.png" className="w-4 h-4" alt="net" />
              My Network Places
           </div>
        </div>
      </SidebarSection>

      <SidebarSection title="Details">
        <div className="bg-white border border-gray-300 p-2 text-[10px] h-[100px]">
           <p className="font-bold">Local Disk (C:)</p>
           <p>Local Disk</p>
           <br/>
           <p>File System: NTFS</p>
           <p>Free Space: 12.4 GB</p>
        </div>
      </SidebarSection>
    </div>
  );
}
