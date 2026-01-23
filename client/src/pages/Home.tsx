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
import { useGitHubProjects } from '@/hooks/useGitHubProjects';

// --- TYPES ---
interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  minimized: boolean;
  zIndex: number;
  props?: any;
}

// --- CONSTANTS ---
const devProfile = {
    name: "Dev",
    role: "Full Stack Developer & AI Enthusiast",
    education: "Punjab Engineering College, Chandigarh",
    location: "Chandigarh, India 🇮🇳",
    email: "devvarthsinghwork@gmail.com",
    interests: ["Generative AI", "Agentic AI Workflows", "System Design", "Open Source"],
    technologies: {
        frontend: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
        backend: ["Node.js", "Express", "MongoDB", "MERN Stack"],
        ai_ml: ["LangChain", "OpenAI SDK", "Vector DBs", "RAG Pipelines"],
        tools: ["Git", "Docker", "Postman", "Linux"]
    },
    currentFocus: "Building Autonomous AI Agents & Scalable Web Apps",
    funFact: "The hardest part of coding isn't writing code... it is naming things"
};

// --- COMPONENT: TABBED PROJECT DETAIL ---
const ProjectDetailContent = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [readme, setReadme] = useState<string>('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  const displayTitle = data.name || data.title || 'Project Details';
  const fullName = data.full_name || displayTitle;
  const createdDate = data.created_at ? format(new Date(data.created_at), 'PPP') : 'Unknown';
  const updatedDate = data.updated_at ? format(new Date(data.updated_at), 'PPP') : 'Unknown';

  useEffect(() => {
     if (activeTab === 'Readme' && !readme && !loadingReadme) {
        if (!data.full_name) {
            setReadme("<p>Cannot fetch Readme: Repository path not found.</p>");
            return;
        }
        setLoadingReadme(true);
        // FETCHING AS HTML NOW instead of raw markdown
        fetch(`https://api.github.com/repos/${data.full_name}/readme`, { 
           headers: { 'Accept': 'application/vnd.github.html' } 
        })
        .then(res => {
           if (res.ok) return res.text();
           throw new Error('No Readme found');
        })
        .then(text => setReadme(text))
        .catch(() => setReadme('<p>No README.md file found for this project.</p>'))
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
        <div className="flex-1 bg-white overflow-hidden relative">
           {activeTab === 'General' && (
              <div className="space-y-6 p-4 overflow-auto h-full animate-in fade-in duration-300">
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
              <div className="h-full flex flex-col">
                 {/* CSS Styles for the rendered Markdown */}
                 <style>{`
                    .readme-content { font-family: 'Tahoma', sans-serif; padding: 20px; color: #24292e; line-height: 1.6; }
                    .readme-content h1, .readme-content h2, .readme-content h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; color: #1A3866; }
                    .readme-content h1 { font-size: 2em; }
                    .readme-content h2 { font-size: 1.5em; }
                    .readme-content p { margin-bottom: 16px; font-size: 14px; }
                    .readme-content a { color: #0366d6; text-decoration: none; }
                    .readme-content a:hover { text-decoration: underline; }
                    .readme-content ul, .readme-content ol { padding-left: 2em; margin-bottom: 16px; }
                    .readme-content ul { list-style-type: disc; }
                    .readme-content img { max-width: 100%; box-sizing: content-box; background-color: transparent; }
                    .readme-content code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: #f6f8fa; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; }
                    .readme-content pre { padding: 16px; overflow: auto; line-height: 1.45; background-color: #f6f8fa; border-radius: 6px; margin-bottom: 16px; }
                    .readme-content pre code { padding: 0; background-color: transparent; }
                    .readme-content blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0 0 16px 0; }
                    .readme-content table { border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; width: 100%; overflow: auto; display: block; }
                    .readme-content table th, .readme-content table td { padding: 6px 13px; border: 1px solid #dfe2e5; }
                    .readme-content table tr:nth-child(2n) { background-color: #f6f8fa; }
                 `}</style>
                 <div className="bg-white border-t border-gray-200 h-full overflow-auto whitespace-normal select-text custom-scrollbar">
                    <div 
                        className="readme-content"
                        dangerouslySetInnerHTML={{ __html: loadingReadme ? "<div style='padding:20px'>Loading README from GitHub...</div>" : readme }}
                    />
                 </div>
              </div>
           )}

           {activeTab === 'Statistics' && (
              <div className="grid grid-cols-2 gap-4 p-4 overflow-auto h-full animate-in fade-in duration-300">
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

// --- SUB-COMPONENTS ---

// UPDATED: MyComputerContent with Zoom, Dark UI, and Download Option
const MyComputerContent = () => {
    const [zoom, setZoom] = useState(1.0);

    const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 2.5));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Devvarth_Singh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex h-full bg-[#f0f0f0] font-sans">
           <SystemSidebar />
           <div className="flex-1 flex flex-col h-full bg-[#525659] overflow-hidden relative">
              {/* Custom Toolbar resembling the screenshot */}
              <div className="h-12 bg-[#323639] flex items-center justify-between px-4 shadow-md shrink-0 z-20">
                 <div className="flex items-center gap-2 text-gray-200">
                    <span className="text-sm font-medium">Resume.pdf</span>
                 </div>
                 
                 <div className="flex items-center gap-1 bg-[#00000033] rounded p-0.5">
                    <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center hover:bg-[#ffffff1a] rounded text-white text-lg rounded-full active:scale-95 transition-transform" title="Zoom Out">
                        －
                    </button>
                    <div className="w-px h-5 bg-gray-600 mx-1"></div>
                    <span className="text-xs text-white min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
                    <div className="w-px h-5 bg-gray-600 mx-1"></div>
                    <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center hover:bg-[#ffffff1a] rounded text-white text-lg rounded-full active:scale-95 transition-transform" title="Zoom In">
                        ＋
                    </button>
                 </div>

                 <div className="flex items-center gap-3">
                    <button onClick={handleDownload} className="text-gray-300 hover:text-white hover:bg-[#ffffff1a] p-2 rounded transition-colors" title="Download">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                       </svg>
                    </button>
                    <button onClick={() => window.print()} className="text-gray-300 hover:text-white hover:bg-[#ffffff1a] p-2 rounded transition-colors" title="Print">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                       </svg>
                    </button>
                 </div>
              </div>

              {/* Document Viewport */}
              <div className="flex-1 overflow-auto p-8 flex justify-center custom-scrollbar">
                 <div 
                    className="bg-white shadow-xl transition-all duration-200 origin-top"
                    style={{ 
                       width: `${800 * zoom}px`, // Base width for A4
                       height: `${1132 * zoom}px`, // Base height for A4
                       minWidth: '300px',
                       marginBottom: '40px'
                    }}
                 >
                    {/* Hiding native toolbar to show our custom one */}
                    <embed 
                       src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                       type="application/pdf"
                       className="w-full h-full"
                    />
                 </div>
              </div>
           </div>
        </div>
    );
};

const AboutMeContent = () => (
  <div className="flex h-full bg-[#ECE9D8] select-text">
    {/* Left Panel - Profile & Quick Info */}
    <div className="w-[220px] bg-[#E3EAFB] border-r border-[#9BB2C9] p-4 flex flex-col gap-4 shrink-0">
      <div className="bg-white p-1 border border-[#9BB2C9] shadow-sm rounded-sm self-center">
        {/* Directly using /profile.jpeg which should be in your public folder */}
        <img 
          src="/profile.jpeg" 
          alt="Profile" 
          className="w-32 h-32 object-cover"
        />
      </div>
      <div className="text-center">
        <h2 className="text-[#1A3866] font-bold text-lg leading-tight">{devProfile.name}</h2>
        <p className="text-xs text-gray-600 mt-1">{devProfile.role}</p>
        <p className="text-xs text-gray-500 mt-0.5">{devProfile.location}</p>
      </div>
      <div className="mt-auto bg-white/50 p-3 rounded border border-[#9BB2C9] text-xs">
        <strong className="text-[#1A3866] block mb-1">Studying at:</strong>
        {devProfile.education}
      </div>
      <a href={`mailto:${devProfile.email}`} className="flex items-center justify-center gap-2 bg-white border border-[#003c74] px-2 py-1 rounded text-xs text-[#003c74] hover:bg-blue-50 cursor-pointer no-underline">
          <img src="https://cdn-icons-png.flaticon.com/512/542/542638.png" className="w-3 h-3" alt="mail" />
          Contact Me
      </a>
    </div>

    {/* Right Panel - Details */}
    <div className="flex-1 bg-white p-6 overflow-auto">
       <div className="mb-6">
          <h3 className="text-[#1A3866] font-bold border-b border-[#D6DFF7] mb-2 pb-1">About Me</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            I am a student at Punjab Engineering College, deeply passionate about <strong>Full Stack Development</strong> and <strong>Generative AI</strong>. 
            My primary focus is on building intelligent, agentic AI workflows and scalable web applications using the MERN stack.
            I love pushing the boundaries of what web apps can do by integrating advanced AI capabilities.
          </p>
          <div className="bg-[#FFFFE1] border border-[#E2C37A] p-2 text-sm text-gray-700 rounded flex gap-2 items-start">
             <span className="text-lg">💡</span> 
             <div>
               <strong>Fun Fact:</strong> {devProfile.funFact}
             </div>
          </div>
       </div>

       <div className="mb-6">
          <h3 className="text-[#1A3866] font-bold border-b border-[#D6DFF7] mb-3 pb-1">Tech Stack</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wider">Frontend</strong>
                <div className="flex flex-wrap gap-1">
                   {devProfile.technologies.frontend.map(t => (
                      <span key={t} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{t}</span>
                   ))}
                </div>
             </div>
             <div>
                <strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wider">Backend</strong>
                <div className="flex flex-wrap gap-1">
                   {devProfile.technologies.backend.map(t => (
                      <span key={t} className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{t}</span>
                   ))}
                </div>
             </div>
             <div>
                <strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wider">AI & Agents</strong>
                <div className="flex flex-wrap gap-1">
                   {devProfile.technologies.ai_ml.map(t => (
                      <span key={t} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">{t}</span>
                   ))}
                </div>
             </div>
             <div>
                <strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wider">Tools</strong>
                <div className="flex flex-wrap gap-1">
                   {devProfile.technologies.tools.map(t => (
                      <span key={t} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-300">{t}</span>
                   ))}
                </div>
             </div>
          </div>
       </div>

       <div>
         <h3 className="text-[#1A3866] font-bold border-b border-[#D6DFF7] mb-3 pb-1">Interests</h3>
         <ul className="list-disc list-inside text-sm text-gray-700 grid grid-cols-2">
            {devProfile.interests.map(i => <li key={i}>{i}</li>)}
         </ul>
       </div>
       
       <div className="mt-6 pt-4 border-t border-[#D6DFF7] text-xs text-gray-500">
          <strong>Contact Email: </strong> {devProfile.email}
       </div>
    </div>
  </div>
);

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
    about: { id: 'about', title: 'About Me', isOpen: false, minimized: false, zIndex: 10 }
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
    return () => window.removeEventListener('click', enableAudio, { once: true });
  }, []);

  // Window Management
  const openWindow = useCallback((id: string, title?: string, props?: any) => {
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
         delete newWindows[id]; // Fully remove dynamic windows
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
         <DesktopIcon label="My Computer" icon={<img src="https://win98icons.alexmeub.com/icons/png/computer-5.png" className="w-full h-full" alt="pc" />} selected={selectedIcon === 'computer'} onClick={() => setSelectedIcon('computer')} onDoubleClick={() => openWindow('computer', 'My Computer')} />
         <DesktopIcon label="My Documents" icon={<img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" className="w-full h-full" alt="docs" />} selected={selectedIcon === 'documents'} onClick={() => setSelectedIcon('documents')} onDoubleClick={() => openWindow('documents', 'My Documents')} />
         <DesktopIcon label="About Me" icon={<img src="https://win98icons.alexmeub.com/icons/png/address_book_user.png" className="w-full h-full" alt="about" />} selected={selectedIcon === 'about'} onClick={() => setSelectedIcon('about')} onDoubleClick={() => openWindow('about', 'About Me')} />
         
         {/* CodeSurfer Live Icon */}
         <DesktopIcon label="CodeSurfer Live" icon={<img src="https://win98icons.alexmeub.com/icons/png/bar_graph_default-1.png" className="w-full h-full" alt="web" />} selected={selectedIcon === 'codesurfer'} onClick={() => setSelectedIcon('codesurfer')} onDoubleClick={() => window.open('https://code-surfer-five.vercel.app/', '_blank')} />
         
         {/* techConnect Icon */}
         <DesktopIcon label="techConnect" icon={<img src="https://win98icons.alexmeub.com/icons/png/address_book_users.png" className="w-full h-full" alt="net" />} selected={selectedIcon === 'techconnect'} onClick={() => setSelectedIcon('techconnect')} onDoubleClick={() => window.open('http://3.106.246.152', '_blank')} />
         
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
               icon={
                 win.id === 'computer' ? "https://cdn-icons-png.flaticon.com/512/2889/2889279.png" : 
                 win.id === 'about' ? "https://cdn-icons-png.flaticon.com/512/3237/3237472.png" :
                 "https://cdn-icons-png.flaticon.com/512/3767/3767084.png"
               }
             >
                {/* --- RENDER CONTENT BASED ON ID --- */}
                
                {win.id === 'computer' && <MyComputerContent />}
                {win.id === 'about' && <AboutMeContent />}
                
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
      
      {/* Interaction Overlay to Fix Audio */}
      {!audioAllowed && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-xs z-50 animate-bounce pointer-events-none">
            Click anywhere to enable audio...
        </div>
      )}
    </div>
  );
}