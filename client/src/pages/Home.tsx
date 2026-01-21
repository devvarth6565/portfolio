import { useState, useEffect } from 'react';
import { XPWindow } from '@/components/XPWindow';
import { Taskbar } from '@/components/Taskbar';
import { DesktopIcon } from '@/components/DesktopIcon';
import { SystemSidebar } from '@/components/Sidebar';
import { MediaPlayer } from '@/components/MediaPlayer';
import { useProjects, useProject } from '@/hooks/use-projects';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

import { StartMenu } from '@/components/StartMenu';

// Types
interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  minimized: boolean;
  zIndex: number;
  props?: any;
}

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  // State
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    computer: { id: 'computer', title: 'My Computer', isOpen: false, minimized: false, zIndex: 10 },
    documents: { id: 'documents', title: 'My Documents', isOpen: false, minimized: false, zIndex: 10 },
  });
  
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startupPlayed, setStartupPlayed] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Startup Sound
  useEffect(() => {
    if (!startupPlayed) {
      const audio = new Audio('/startup.mp3');
      audio.volume = 0.4;
      // Many browsers block autoplay, so we try/catch
      audio.play().catch(e => console.log("Startup sound blocked:", e));
      setStartupPlayed(true);
    }
  }, [startupPlayed]);

  // Window Management
  const openWindow = (id: string, title?: string, props?: any) => {
    const isMediaPlayer = id === 'media-player' || id === 'media_player';
    const finalId = isMediaPlayer ? 'media-player' : id;
    
    setWindows(prev => ({
      ...prev,
      [finalId]: {
        id: finalId,
        title: title || prev[finalId]?.title || 'Window',
        isOpen: true,
        minimized: false,
        zIndex: Math.max(...Object.values(prev).map(w => w.zIndex), 0) + 1,
        props
      }
    }));
    setActiveWindowId(finalId);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => {
      const newWindows = { ...prev };
      // Instead of deleting, we mark isOpen=false to keep state if needed, or delete for dynamic ones
      if (id.startsWith('project-')) {
         delete newWindows[id];
      } else {
         newWindows[id].isOpen = false;
      }
      return newWindows;
    });
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], minimized: true }
    }));
    setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    const w = windows[id];
    if (w.minimized) {
      // Restore
      setWindows(prev => ({
        ...prev,
        [id]: { ...prev[id], minimized: false, zIndex: Math.max(...Object.values(prev).map(w => w.zIndex), 0) + 1 }
      }));
    } else {
      // Just focus
      setWindows(prev => ({
        ...prev,
        [id]: { ...prev[id], zIndex: Math.max(...Object.values(prev).map(w => w.zIndex), 0) + 1 }
      }));
    }
    setActiveWindowId(id);
  };

  // Content for My Computer (About Me)
  const MyComputerContent = () => (
    <div className="flex h-full bg-white">
       <SystemSidebar />
       <div className="flex-1 bg-white p-4 overflow-auto">
          <div className="mb-4">
             <h2 className="font-bold text-lg mb-2 text-[#1A3866]">Hard Disk Drives</h2>
             <div className="flex gap-8 border-t border-[#D6DFF7] pt-4">
                <div className="flex gap-2 items-center w-[250px] cursor-pointer hover:bg-blue-50 p-2 rounded border border-transparent hover:border-blue-200">
                   <img src="https://cdn-icons-png.flaticon.com/512/2333/2333066.png" className="w-10 h-10" alt="hdd" />
                   <div>
                      <div className="font-bold text-sm">Local Disk (C:)</div>
                      <div className="text-xs text-gray-500">Free Space: 12.4 GB</div>
                      <div className="w-full h-3 bg-gray-200 border border-gray-400 mt-1 relative">
                         <div className="absolute left-0 top-0 h-full w-[80%] bg-blue-600"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="mb-4">
             <h2 className="font-bold text-lg mb-2 text-[#1A3866]">Resume (PDF)</h2>
             <div className="border-t border-[#D6DFF7] pt-4 h-[500px]">
                <iframe src="/resume.pdf" className="w-full h-full border border-gray-300" title="Resume"></iframe>
             </div>
          </div>
       </div>
    </div>
  );

  // Content for My Documents (Projects)
  const MyDocumentsContent = () => (
    <div className="flex h-full bg-white">
       <SystemSidebar />
       <div className="flex-1 bg-white p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2 text-[#1A3866]">File and Folder Tasks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {projectsLoading ? (
               <div className="col-span-full flex items-center justify-center p-10">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
               </div>
             ) : (
               projects?.map(project => (
                 <div 
                   key={project.id}
                   className="flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-200 rounded cursor-pointer group"
                   onDoubleClick={() => {
                     if (project.title.toLowerCase().includes('codesurfer') || project.id.toString() === 'codesurfer') {
                       openWindow('media-player', 'CodeSurfer - Windows Media Player', { videoUrl: '/codesurfer.mp4', autoPlay: true });
                     } else {
                       openWindow(`project-${project.id}`, project.title);
                     }
                   }}
                 >
                    <img 
                      src={project.icon === 'file' ? "https://cdn-icons-png.flaticon.com/512/2965/2965335.png" : "https://cdn-icons-png.flaticon.com/512/3767/3767084.png"} 
                      className="w-12 h-12 drop-shadow-sm mb-1" 
                      alt="folder" 
                    />
                    <span className="text-xs text-center line-clamp-2 group-hover:text-blue-700">{project.title}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{project.date}</span>
                 </div>
               ))
             )}
             
             {/* Add Dummy Projects if API is empty for visual effect */}
             {(!projects || projects.length === 0) && !projectsLoading && (
               <>
                 {[1, 2, 3].map(i => (
                    <div 
                      key={i}
                      className="flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-200 rounded cursor-pointer group"
                      onDoubleClick={() => openWindow(`project-demo-${i}`, `Demo Project ${i}`)}
                    >
                       <img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" className="w-12 h-12 drop-shadow-sm mb-1" alt="folder" />
                       <span className="text-xs text-center group-hover:text-blue-700">Project Demo {i}</span>
                       <span className="text-[10px] text-gray-400 mt-0.5">Oct 200{i}</span>
                    </div>
                 ))}
               </>
             )}
          </div>
       </div>
    </div>
  );

  // Content for Individual Project Detail
  const ProjectDetailContent = ({ id, props }: { id: string, props?: any }) => {
    // If it's a demo project (from dummy data)
    if (id.includes('demo')) {
      return (
        <div className="flex h-full bg-white flex-col p-6 overflow-auto">
            <h1 className="text-2xl font-bold text-[#1A3866] mb-4">Demo Project Detail</h1>
            <div className="bg-[#FFFFE1] border border-[#D6DFF7] p-4 mb-6 shadow-sm">
               <p className="text-sm">This is a simulated project because the database might be empty. In a real scenario, this would load data from the API.</p>
            </div>
            <MediaPlayer title="Demo Project Video" videoUrl={props?.videoUrl} />
            <div className="mt-6 text-sm text-gray-800">
               <p>This project demonstrates the capabilities of the Windows XP simulation. It features a fully functional window system, taskbar, and start menu.</p>
            </div>
        </div>
      );
    }

    // Real API Project
    const projectId = parseInt(id.replace('project-', ''));
    const { data: project, isLoading } = useProject(projectId);

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;
    if (!project) return <div className="p-10 text-center">Project not found.</div>;

    return (
       <div className="flex h-full bg-white flex-col p-6 overflow-auto">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
             <img src="https://cdn-icons-png.flaticon.com/512/2965/2965335.png" className="w-16 h-16" alt="icon" />
             <div>
                <h1 className="text-2xl font-bold text-[#1A3866]">{project.title}</h1>
                <p className="text-gray-500 text-sm">{project.date} • {project.description}</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div>
                <h3 className="font-bold text-[#1A3866] mb-2 border-b border-gray-300 pb-1">Project Overview</h3>
                <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: project.content || project.description }} />
             </div>
             <div>
                <h3 className="font-bold text-[#1A3866] mb-2 border-b border-gray-300 pb-1">Media</h3>
                <MediaPlayer videoUrl={props?.videoUrl || project.videoUrl} title={project.title} />
             </div>
          </div>
       </div>
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative" onClick={() => setSelectedIcon(null)}>
      
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-0">
         <DesktopIcon 
           label="My Computer"
           icon={<img src="https://cdn-icons-png.flaticon.com/512/2889/2889279.png" className="w-full h-full" alt="pc" />}
           selected={selectedIcon === 'computer'}
           onClick={() => setSelectedIcon('computer')}
           onDoubleClick={() => openWindow('computer')}
         />
         <DesktopIcon 
           label="My Documents"
           icon={<img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" className="w-full h-full" alt="docs" />}
           selected={selectedIcon === 'documents'}
           onClick={() => setSelectedIcon('documents')}
           onDoubleClick={() => openWindow('documents')}
         />
         <DesktopIcon 
           label="Internet Explorer"
           icon={<img src="https://cdn-icons-png.flaticon.com/512/888/888859.png" className="w-full h-full" alt="ie" />}
           selected={selectedIcon === 'ie'}
           onClick={() => setSelectedIcon('ie')}
           onDoubleClick={() => window.open('https://github.com/devvarthsingh', '_blank')}
         />
         <DesktopIcon 
           label="Recycle Bin"
           icon={<img src="https://cdn-icons-png.flaticon.com/512/3143/3143460.png" className="w-full h-full" alt="bin" />}
           selected={selectedIcon === 'bin'}
           onClick={() => setSelectedIcon('bin')}
           onDoubleClick={() => {}} // Empty for now
         />
      </div>

      {/* Windows Area */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Object.values(windows).map((win) => (
           <div key={win.id} className="pointer-events-auto">
             <XPWindow
               id={win.id}
               title={win.title}
               isOpen={win.isOpen}
               minimized={win.minimized}
               isActive={activeWindowId === win.id}
               onClick={() => focusWindow(win.id)}
               onClose={() => closeWindow(win.id)}
               onMinimize={() => minimizeWindow(win.id)}
               icon={win.id === 'computer' ? "https://cdn-icons-png.flaticon.com/512/2889/2889279.png" : (win.id === 'media-player' ? "https://cdn-icons-png.flaticon.com/512/888/888879.png" : "https://cdn-icons-png.flaticon.com/512/3767/3767084.png")}
             >
                {win.id === 'computer' && <MyComputerContent />}
                {win.id === 'documents' && <MyDocumentsContent />}
                {win.id.startsWith('project-') && <ProjectDetailContent id={win.id} props={win.props} />}
                {win.id === 'media-player' && <MediaPlayer title={win.title} videoUrl={win.props?.videoUrl} />}
             </XPWindow>
           </div>
        ))}
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <StartMenu 
            isOpen={isStartMenuOpen} 
            onClose={() => setIsStartMenuOpen(false)}
            onOpenWindow={openWindow}
          />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar 
        openWindows={Object.values(windows).filter(w => w.isOpen)}
        activeWindowId={activeWindowId}
        onWindowClick={(id) => focusWindow(id)}
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
      />
    </div>
  );
}
