import { useState, useEffect, useCallback } from 'react';
import { XPWindow } from '@/components/XPWindow';
import { Taskbar } from '@/components/Taskbar';
import { DesktopIcon } from '@/components/DesktopIcon';
import { SystemSidebar } from '@/components/Sidebar';
import { MediaPlayer } from '@/components/MediaPlayer';
import { StartMenu } from '@/components/StartMenu';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Ensure this path matches your hooks folder
import { useGitHubProjects, GitHubRepo } from '@/hooks/useGitHubProjects';

// --- TYPES ---
interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  minimized: boolean;
  zIndex: number;
  props?: any;
}

// --- COMPONENT: TABBED PROJECT DETAIL ---
const ProjectDetailContent = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [readme, setReadme] = useState<string>('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  // Fallback for title/name
  const displayTitle = data.name || data.title || 'Project Details';
  const fullName = data.full_name || displayTitle;

  const createdDate = data.created_at ? format(new Date(data.created_at), 'PPP') : 'Unknown';
  const updatedDate = data.updated_at ? format(new Date(data.updated_at), 'PPP') : 'Unknown';

  useEffect(() => {
     if (activeTab === 'Readme' && !readme && !loadingReadme) {
        if (!data.full_name) {
            setReadme("Cannot fetch Readme: Repository path not found.");
            return;
        }
        setLoadingReadme(true);
        fetch(`https://api.github.com/repos/${data.full_name}/readme`, { 
           headers: { 'Accept': 'application/vnd.github.raw' } 
        })
        .then(res => {
           if (res.ok) return res.text();
           throw new Error('No Readme found');
        })
        .then(text => setReadme(text))
        .catch(() => setReadme('No README.md file found for this project.\n\nPlease check the "General" tab for details.'))
        .finally(() => setLoadingReadme(false));
     }
  }, [activeTab, data.full_name, readme, loadingReadme]);

  return (
     <div className="flex flex-col h-full bg-[#ECE9D8]">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-white border-b border-[#D6DFF7] shrink-0">
           <img src="https://cdn-icons-png.flaticon.com/512/2965/2965335.png" className="w-12 h-12" alt="icon" />
           <div>
              <h1 className="text-xl font-bold text-[#1A3866]">{displayTitle}</h1>
              <p className="text-gray-500 text-xs">{fullName}</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2 pt-2 border-b border-gray-400 gap-1 bg-[#ECE9D8] shrink-0 select-none">
           {['General', 'Readme', 'Statistics'].map(tab => (
              <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-1 text-sm rounded-t-md border-t border-l border-r border-gray-400 focus:outline-none mb-[-1px] z-10 ${
                    activeTab === tab 
                    ? 'bg-white font-bold border-b-white pb-2 mt-[-2px]' 
                    : 'bg-[#ECE9D8] text-gray-600 hover:bg-[#f7f6f1]'
                 }`}
              >
                 {tab}
              </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 bg-white overflow-auto relative">
           {activeTab === 'General' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div>
                    <h3 className="font-bold text-[#1A3866] border-b border-gray-200 mb-2">Description</h3>
                    <p className="text-sm text-gray-800 leading-relaxed font-sans">
                       {data.description || "No description provided."}
                    </p>
                 </div>
                 {data.topics && data.topics.length > 0 && (
                    <div>
                       <h3 className="font-bold text-[#1A3866] border-b border-gray-200 mb-2">Topics</h3>
                       <div className="flex flex-wrap gap-2">
                          {data.topics.map((topic: string) => (
                             <span key={topic} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full">#{topic}</span>
                          ))}
                       </div>
                    </div>
                 )}
                 <div>
                    <h3 className="font-bold text-[#1A3866] border-b border-gray-200 mb-2">Links</h3>
                    <div className="flex gap-3">
                       {data.html_url && (
                           <a href={data.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 border border-[#003c74] rounded bg-white hover:bg-gray-50 text-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px]">
                              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-4 h-4" alt="gh" /> View Source
                           </a>
                       )}
                       {data.homepage && (
                          <a href={data.homepage} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 border border-[#003c74] rounded bg-white hover:bg-gray-50 text-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px]">
                             <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" className="w-4 h-4" alt="web" /> Website
                          </a>
                       )}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'Readme' && (
              <div className="h-full flex flex-col font-mono text-xs">
                 <div className="bg-white border border-gray-300 p-2 h-full overflow-auto whitespace-pre-wrap select-text shadow-inner">
                    {loadingReadme ? "Loading..." : readme}
                 </div>
              </div>
           )}

           {activeTab === 'Statistics' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded"><div className="text-gray-500 text-xs">Stars</div><div className="text-xl font-bold text-yellow-600">★ {data.stargazers_count}</div></div>
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded"><div className="text-gray-500 text-xs">Forks</div><div className="text-xl font-bold text-gray-700">⑂ {data.forks_count}</div></div>
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded"><div className="text-gray-500 text-xs">Issues</div><div className="text-xl font-bold text-red-600">⚠ {data.open_issues_count}</div></div>
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded"><div className="text-gray-500 text-xs">Language</div><div className="text-xl font-bold text-blue-600">{data.language || 'N/A'}</div></div>
                 <div className="col-span-2 p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                       <span className="text-gray-500">Created:</span><span>{createdDate}</span>
                       <span className="text-gray-500">Last Updated:</span><span>{updatedDate}</span>
                    </div>
                 </div>
              </div>
           )}
        </div>
     </div>
  );
};

// --- SUB-COMPONENTS (Defined OUTSIDE Home to prevent re-render bugs) ---
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

// We pass props to this component now
const MyDocumentsContent = ({ projects, isLoading, onProjectClick }: { projects: any[], isLoading: boolean, onProjectClick: (p: any) => void }) => (
    <div className="flex h-full bg-white">
       <SystemSidebar />
       <div className="flex-1 bg-white p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2 text-[#1A3866]">File and Folder Tasks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {isLoading ? (
               <div className="col-span-full flex items-center justify-center p-10"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
             ) : (
               projects?.map((project: any) => (
                   <div 
                     key={project.id}
                     className="flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-200 rounded cursor-pointer group"
                     onDoubleClick={() => onProjectClick(project)}
                   >
                      <img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" className="w-12 h-12 drop-shadow-sm mb-1" alt="folder" />
                      <span className="text-xs text-center line-clamp-2 group-hover:text-blue-700 select-none">
                        {project.name || project.title || "Untitled"}
                      </span>
                   </div>
               ))
             )}
          </div>
       </div>
    </div>
);

// --- MAIN HOME COMPONENT ---
export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useGitHubProjects();
  
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    computer: { id: 'computer', title: 'My Computer', isOpen: false, minimized: false, zIndex: 10 },
    documents: { id: 'documents', title: 'My Documents', isOpen: false, minimized: false, zIndex: 10 },
  });
  
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);

  // One-time interaction listener for audio
  useEffect(() => {
    const enableAudio = () => {
        setAudioAllowed(true);
        const audio = new Audio('/startup.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => {}); // Silent catch
    };
    window.addEventListener('click', enableAudio, { once: true });
    return () => window.removeEventListener('click', enableAudio);
  }, []);

  // Window Management
  const openWindow = useCallback((id: string, title?: string, props?: any) => {
    console.log(`Opening window: ${id}`, title || 'Default Title');
    
    const isMediaPlayer = id === 'media-player';
    const finalId = isMediaPlayer ? 'media-player' : id;
    
    setWindows(prev => ({
      ...prev,
      [finalId]: {
        id: finalId,
        title: title || prev[finalId]?.title || 'Window',
        isOpen: true,
        minimized: false,
        zIndex: Math.max(...Object.values(prev).map(w => w.zIndex), 0) + 1,
        props: props
      }
    }));
    setActiveWindowId(finalId);
  }, []);

  const closeWindow = (id: string) => {
    setWindows(prev => {
      const newWindows = { ...prev };
      if (id.startsWith('project-')) {
         delete newWindows[id]; // Fully remove dynamic windows so they reset when opened again
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
    const newZ = Math.max(...Object.values(windows).map(w => w.zIndex), 0) + 1;
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], minimized: false, zIndex: newZ }
    }));
    setActiveWindowId(id);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative" onClick={() => setSelectedIcon(null)}>
      
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-0">
         <DesktopIcon label="My Computer" icon={<img src="https://cdn-icons-png.flaticon.com/512/2889/2889279.png" className="w-full h-full" alt="pc" />} selected={selectedIcon === 'computer'} onClick={() => setSelectedIcon('computer')} onDoubleClick={() => openWindow('computer', 'My Computer')} />
         <DesktopIcon label="My Documents" icon={<img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" className="w-full h-full" alt="docs" />} selected={selectedIcon === 'documents'} onClick={() => setSelectedIcon('documents')} onDoubleClick={() => openWindow('documents', 'My Documents')} />
         <DesktopIcon label="GitHub" icon={<img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-full h-full" alt="gh" />} selected={selectedIcon === 'github'} onClick={() => setSelectedIcon('github')} onDoubleClick={() => window.open('https://github.com/devvarth6565', '_blank')} />
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
               icon={win.id === 'computer' ? "https://cdn-icons-png.flaticon.com/512/2889/2889279.png" : "https://cdn-icons-png.flaticon.com/512/3767/3767084.png"}
             >
                {/* --- RENDER CONTENT BASED ON ID --- */}
                
                {win.id === 'computer' && <MyComputerContent />}
                
                {win.id === 'documents' && (
                    <MyDocumentsContent 
                        projects={projects} 
                        isLoading={projectsLoading} 
                        onProjectClick={(project) => {
                            const pTitle = project.name || project.title || "Untitled";
                            if (pTitle.toLowerCase().includes('codesurfer')) {
                                openWindow('media-player', 'CodeSurfer - Media Player', { videoUrl: '/codesurfer.mp4', autoPlay: true });
                            } else {
                                openWindow(`project-${project.id}`, pTitle, { projectData: project });
                            }
                        }}
                    />
                )}
                
                {/* Project Details */}
                {win.id.startsWith('project-') && win.props?.projectData && (
                  <ProjectDetailContent data={win.props.projectData} />
                )}
                
                {win.id === 'media-player' && <MediaPlayer title={win.title} videoUrl={win.props?.videoUrl} />}
             </XPWindow>
           </div>
        ))}
      </div>

      <AnimatePresence>
        {isStartMenuOpen && <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} onOpenWindow={openWindow} />}
      </AnimatePresence>

      <Taskbar openWindows={Object.values(windows).filter(w => w.isOpen)} activeWindowId={activeWindowId} onWindowClick={(id) => focusWindow(id)} onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)} />
      
      {/* Interaction Overlay to Fix Audio (Optional - can be removed if you prefer silence) */}
      {!audioAllowed && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-xs z-50 animate-bounce pointer-events-none">
            Click anywhere to enable audio...
        </div>
      )}
    </div>
  );
}