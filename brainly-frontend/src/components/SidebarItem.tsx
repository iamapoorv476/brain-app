import { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  isActive?: boolean;
  onClick?: () => void;
  count?: number;
  badge?: string;
}

export function SidebarItem({ 
  text, 
  icon, 
  isActive = false, 
  onClick, 
  count,
  badge 
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
        isActive
          ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`flex-shrink-0 transition-colors duration-200 ${
          isActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-700'
        }`}>
          {icon}
        </div>
        <span className={`font-medium truncate transition-colors duration-200 ${
          isActive ? 'text-purple-700' : 'text-gray-700 group-hover:text-gray-900'
        }`}>
          {text}
        </span>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
       
        {count !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium transition-colors duration-200 ${
            isActive
              ? 'bg-purple-200 text-purple-700'
              : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
          }`}>
            {count}
          </span>
        )}
        
        
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            badge === 'new' ? 'bg-green-100 text-green-700' :
            badge === 'hot' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}