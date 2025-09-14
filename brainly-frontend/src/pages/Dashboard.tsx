import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModel";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { useContent } from "../hooks/useContents";
import { Sidebar } from "../components/Sidebar";
import { Settings } from "../pages/Settings";
import axios from "axios";


interface ThemeClasses {
  theme: string;
  isDark: boolean;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  mutedTextClass: string;
  borderClass: string;
  inputBgClass: string;
  placeholderClass: string;
}

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalResults: number;
  isDark: boolean;
  cardBgClass: string;
  borderClass: string;
  textClass: string;
  mutedTextClass: string;
  placeholderClass: string;
}

interface FilterTabsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  contentCounts: {
    total: number;
    youtube: number;
    twitter: number;
  };
  isDark: boolean;
  cardBgClass: string;
  borderClass: string;
  textClass: string;
}

interface ViewToggleProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  isDark: boolean;
  cardBgClass: string;
}

interface StatsBarProps {
  totalContent: number;
  filteredContent: number;
  activeFilter: string;
  isDark: boolean;
  cardBgClass: string;
  borderClass: string;
  textClass: string;
  mutedTextClass: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  isDark: boolean;
  cardBgClass: string;
  textClass: string;
  mutedTextClass: string;
}

interface EmptyStateProps {
  searchQuery: string;
  activeFilter: string;
  onAddContent: () => void;
  isDark: boolean;
  cardBgClass: string;
  borderClass: string;
  textClass: string;
  mutedTextClass: string;
}

interface ApiResponse {
  hash: string;
  data?: any;
}

function useTheme(): ThemeClasses {
  const [theme, setTheme] = useState<string>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };
    
    const checkTheme = () => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    };
    
    const interval = setInterval(checkTheme, 100);
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [theme]);
  
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return {
    theme,
    isDark,
    bgClass: isDark ? 'bg-slate-900' : 'bg-gray-50',
    cardBgClass: isDark ? 'bg-slate-800' : 'bg-white',
    textClass: isDark ? 'text-slate-100' : 'text-gray-900',
    mutedTextClass: isDark ? 'text-slate-400' : 'text-gray-600',
    borderClass: isDark ? 'border-slate-700' : 'border-gray-200',
    inputBgClass: isDark ? 'bg-slate-800' : 'bg-white',
    placeholderClass: isDark ? 'placeholder-slate-400' : 'placeholder-gray-500'
  };
}

function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  totalResults, 
  isDark, 
  cardBgClass, 
  borderClass, 
  textClass, 
  mutedTextClass, 
  placeholderClass 
}: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search your brain..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 ${cardBgClass} ${placeholderClass} ${borderClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm`}
      />
      {searchQuery && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'text-slate-400 bg-slate-700' : 'text-gray-500 bg-gray-100'}`}>
            {totalResults} found
          </span>
        </div>
      )}
    </div>
  );
}

function FilterTabs({ activeFilter, setActiveFilter, contentCounts, isDark, cardBgClass, borderClass, textClass }: FilterTabsProps) {
  const filters = [
    { id: 'all', label: 'All', count: contentCounts.total },
    { id: 'youtube', label: 'YouTube', count: contentCounts.youtube },
    { id: 'twitter', label: 'Twitter', count: contentCounts.twitter },
  ];

  return (
    <div className={`flex space-x-1 rounded-xl p-1 mb-6 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeFilter === filter.id
              ? `${cardBgClass} text-purple-700 shadow-sm ring-1 ring-purple-200`
              : `${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
          }`}
        >
          {filter.label}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeFilter === filter.id 
              ? 'bg-purple-100 text-purple-700' 
              : isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function ViewToggle({ viewMode, setViewMode, isDark, cardBgClass }: ViewToggleProps) {
  return (
    <div className={`flex rounded-lg p-1 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          viewMode === 'grid' 
            ? `${cardBgClass} text-purple-600 shadow-sm` 
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800'
        }`}
        title="Grid View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          viewMode === 'list' 
            ? `${cardBgClass} text-purple-600 shadow-sm` 
            : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800'
        }`}
        title="List View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}

function StatsBar({ totalContent, filteredContent, activeFilter, isDark, cardBgClass, borderClass, textClass, mutedTextClass }: StatsBarProps) {
  const getFilterLabel = () => {
    switch(activeFilter) {
      case 'youtube': return 'YouTube videos';
      case 'twitter': return 'Twitter posts';
      default: return 'items';
    }
  };

  return (
    <div className={`${cardBgClass} rounded-xl border ${borderClass} p-4 mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className={`text-sm ${mutedTextClass}`}>
              Showing <span className={`font-semibold ${textClass}`}>{filteredContent}</span> of <span className={`font-semibold ${textClass}`}>{totalContent}</span> {getFilterLabel()}
            </span>
          </div>
        </div>
        <div className={`text-sm ${mutedTextClass}`}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function ShareModal({ isOpen, onClose, shareUrl, isDark, cardBgClass, textClass, mutedTextClass }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className={`${cardBgClass} rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShareIcon />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${textClass}`}>🧠 Share Your Brain</h2>
          <p className={mutedTextClass}>
            Anyone with this link can view your curated content collection
          </p>
        </div>
        
        <div className="space-y-4">
          <div className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className={`flex-1 bg-transparent text-sm font-mono outline-none ${textClass}`}
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                copied 
                  ? 'bg-green-500 text-white scale-105' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className={`px-6 py-2 font-medium transition-colors rounded-lg ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ searchQuery, activeFilter, onAddContent, isDark, cardBgClass, borderClass, textClass, mutedTextClass }: EmptyStateProps) {
  const getEmptyMessage = () => {
    if (searchQuery) {
      return {
        title: "No results found",
        subtitle: `No content matches "${searchQuery}". Try a different search term.`,
        showButton: false
      };
    }
    
    if (activeFilter !== 'all') {
      return {
        title: `No ${activeFilter} content yet`,
        subtitle: `You haven't added any ${activeFilter} content to your brain. Start building your collection!`,
        showButton: true
      };
    }
    
    return {
      title: "Your brain is empty",
      subtitle: "Start building your second brain by adding your first piece of content. Capture ideas, videos, and tweets that matter to you.",
      showButton: true
    };
  };

  const { title, subtitle, showButton } = getEmptyMessage();

  return (
    <div className={`text-center py-16 ${cardBgClass} rounded-2xl border-2 border-dashed ${borderClass}`}>
      <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
        <svg className={`w-12 h-12 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className={`text-xl font-semibold mb-3 ${textClass}`}>{title}</h3>
      <p className={`mb-8 max-w-md mx-auto leading-relaxed ${mutedTextClass}`}>{subtitle}</p>
      {showButton && (
        <Button 
          onClick={onAddContent}
          variant="primary" 
          text="Add Your First Content" 
          startIcon={<PlusIcon />}
        />
      )}
    </div>
  );
}

export function Dashboard() {
  const [currentSection, setCurrentSection] = useState('dashboard'); 
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { contents, refresh, loading, error } = useContent();
  
  const { theme, isDark, bgClass, cardBgClass, textClass, mutedTextClass, borderClass, placeholderClass } = useTheme();

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  const filteredContent = contents.filter(content => {
    const matchesSearch = !searchQuery || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (content.tags && content.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && content.type === activeFilter;
  });

  const contentCounts = {
    total: contents.length,
    youtube: contents.filter(c => c.type === 'youtube').length,
    twitter: contents.filter(c => c.type === 'twitter').length,
  };

  const handleShareBrain = async () => {
    setIsSharing(true);
    try {
      const response = await axios.post<ApiResponse>("/api/v1/shareLink", {
        share: true,
      }, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      
      const url = `http://localhost:5173/share/${response.data.hash}`;
      setShareUrl(url);
      setShareModalOpen(true);
      
    } catch (error) {
      console.error("Error creating share link:", error);
      alert("Failed to create share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  if (loading && contents.length === 0) {
    return (
      <div className={`min-h-screen ${bgClass}`}>
        <Sidebar
          activeSection={currentSection}
          onSectionChange={setCurrentSection}
          totalContent={contents.length}
          theme={theme}
        />
        <div className="p-6 ml-72">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
              <p className={mutedTextClass}>Loading your brain...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${bgClass}`}>
        <Sidebar 
          activeSection={currentSection}
          onSectionChange={setCurrentSection}
          totalContent={contents.length}
          theme={theme}
        />
        <div className="p-6 ml-72">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 mb-2">⚠️ Error Loading Content</div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={refresh} variant="primary" text="Try Again" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Sidebar 
        activeSection={currentSection}
        onSectionChange={setCurrentSection}
        totalContent={contents.length}
        theme={theme}
      />
      
      <div className="p-6 ml-72">
        {currentSection === 'settings' ? (
          <Settings />
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className={`text-3xl font-bold mb-2 ${textClass}`}>
                    Your Second Brain 🧠
                  </h1>
                  <p className={mutedTextClass}>
                    Capture, organize, and rediscover your digital knowledge
                  </p>
                </div>
                <ViewToggle 
                  viewMode={viewMode} 
                  setViewMode={setViewMode}
                  isDark={isDark}
                  cardBgClass={cardBgClass}
                />
              </div>

              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                totalResults={filteredContent.length}
                isDark={isDark}
                cardBgClass={cardBgClass}
                borderClass={borderClass}
                textClass={textClass}
                mutedTextClass={mutedTextClass}
                placeholderClass={placeholderClass}
              />

              <FilterTabs 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                contentCounts={contentCounts}
                isDark={isDark}
                cardBgClass={cardBgClass}
                borderClass={borderClass}
                textClass={textClass}
              />

              <StatsBar 
                totalContent={contents.length}
                filteredContent={filteredContent.length}
                activeFilter={activeFilter}
                isDark={isDark}
                cardBgClass={cardBgClass}
                borderClass={borderClass}
                textClass={textClass}
                mutedTextClass={mutedTextClass}
              />
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4">
                <Button 
                  onClick={() => setModalOpen(true)}
                  variant="primary" 
                  text="Add Content" 
                  startIcon={<PlusIcon />}
                />
                <Button 
                  onClick={handleShareBrain}
                  variant="secondary" 
                  text={isSharing ? "Creating Link..." : "Share Brain"} 
                  startIcon={<ShareIcon />}
                  loading={isSharing}
                />
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                  <span className="text-sm">Syncing...</span>
                </div>
              )}
            </div>

            {filteredContent.length === 0 ? (
              <EmptyState 
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onAddContent={() => setModalOpen(true)}
                isDark={isDark}
                cardBgClass={cardBgClass}
                borderClass={borderClass}
                textClass={textClass}
                mutedTextClass={mutedTextClass}
              />
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
              } transition-all duration-300`}>
                {filteredContent.map((content, index) => (
                  <div 
                    key={content._id}
                    className="transform transition-all duration-300 hover:scale-105"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <Card 
                      type={content.type}
                      link={content.links}
                      title={content.title}
                    />
                  </div>
                ))}
              </div>
            )}

            <CreateContentModal 
              open={modalOpen} 
              onClose={() => setModalOpen(false)}
              onContentAdded={() => refresh()}
            />
            
            <ShareModal 
              isOpen={shareModalOpen}
              onClose={() => setShareModalOpen(false)}
              shareUrl={shareUrl}
              isDark={isDark}
              cardBgClass={cardBgClass}
              textClass={textClass}
              mutedTextClass={mutedTextClass}
            />
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .zoom-in-95 {
          animation: zoomIn95 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}