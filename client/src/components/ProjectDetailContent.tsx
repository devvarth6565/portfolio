import React from 'react';

interface ProjectDetailContentProps {
  title: string;
  description: string;
  stars: number;
  language: string | null;
  html_url: string;
}

export function ProjectDetailContent({ 
  title, 
  description, 
  stars, 
  language, 
  html_url 
}: ProjectDetailContentProps) {
  return (
    <div className="p-4 bg-white h-full overflow-auto font-['Tahoma']">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#003399] mb-2">{title}</h2>
          <p className="text-sm text-gray-700">{description}</p>
        </div>

        <div className="border-t border-gray-300 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">⭐ Stars:</span>
            <span className="text-sm">{stars}</span>
          </div>
          
          {language && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">💻 Language:</span>
              <span className="text-sm">{language}</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={() => window.open(html_url, '_blank')}
            className="px-4 py-2 bg-[#ECE9D8] border border-[#003399] text-[#003399] 
                     hover:bg-[#D4D0C8] active:border-inset shadow-sm text-sm font-semibold
                     rounded-sm transition-colors"
            style={{
              boxShadow: '1px 1px 0 #fff, 2px 2px 0 #808080'
            }}
          >
            View on GitHub →
          </button>
        </div>
      </div>
    </div>
  );
}