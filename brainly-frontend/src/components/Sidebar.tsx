import { Logo } from "../icons/Logo";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  totalContent?: number;
  theme?: string; 
}

export function Sidebar({ 
  activeSection = 'dashboard', 
  onSectionChange,
  totalContent = 0,
  theme = 'light' 
}: SidebarProps) {
  const handleSectionChange = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  
  const bgClass = isDark ? 'bg-slate-900' : 'bg-white';
  const borderClass = isDark ? 'border-slate-700' : 'border-gray-100';
  const textClass = isDark ? 'text-slate-100' : 'text-gray-900';
  const mutedTextClass = isDark ? 'text-slate-400' : 'text-gray-500';
  const footerBgClass = isDark ? 'bg-slate-800' : 'bg-gray-50';
  const progressBgClass = isDark ? 'bg-slate-700' : 'bg-gray-200';

  return (
    <div className={`h-screen ${bgClass} border-r ${borderClass} w-72 fixed left-0 top-0 flex flex-col shadow-sm`}>
      
      <div className={`px-6 py-8 border-b ${borderClass}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Logo />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${textClass}`}>Brainly</h1>
          </div>
        </div>
        <p className={`text-sm ${mutedTextClass} ml-13`}>Your Second Brain</p>
      </div>

      
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          <SidebarItem
            text="Dashboard"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
              </svg>
            }
            isActive={activeSection === 'dashboard'}
            onClick={() => handleSectionChange('dashboard')}
            count={totalContent}
            isDark={isDark}
          />

          <SidebarItem
            text="Settings"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            isActive={activeSection === 'settings'}
            onClick={() => handleSectionChange('settings')}
            isDark={isDark}
          />
        </nav>
      </div>

      
      <div className={`px-6 py-4 border-t ${borderClass} ${footerBgClass}`}>
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span className={mutedTextClass}>Total Items</span>
            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{totalContent}</span>
          </div>
          <div className={`w-full ${progressBgClass} rounded-full h-1.5`}>
            <div 
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" 
              style={{width: `${Math.min(100, (totalContent / 50) * 100)}%`}}
            ></div>
          </div>
          <div className={`text-xs ${mutedTextClass} text-center`}>
            {totalContent < 10 ? "Just getting started!" : 
             totalContent < 50 ? "Building your brain..." : 
             "Knowledge master! 🧠"}
          </div>
        </div>
        <div className={`text-xs ${mutedTextClass} text-center`}>
         
        </div>
      </div>
    </div>
  );
}