import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username?: string;
}

export function Settings() {
  const [username, setUsername] = useState<string>("User");
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.username) {
          setUsername(decoded.username);
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }

    
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedNotifications = localStorage.getItem("notifications") !== "false";
    
    setTheme(savedTheme);
    setNotifications(savedNotifications);
    
    
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f1f5f9';
    } else if (selectedTheme === 'auto') {
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f1f5f9';
      } else {
        root.classList.remove('dark');
        document.body.style.backgroundColor = '#f9fafb';
        document.body.style.color = '#111827';
      }
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
      document.body.style.color = '#111827';
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleNotificationsChange = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem("notifications", newNotifications.toString());
    
   
    if (newNotifications) {
      alert("Notifications enabled!");
    } else {
      alert("Notifications disabled!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
    localStorage.removeItem("notifications");
    
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
    navigate("/signin");
  };

  const handleExportData = () => {
    
    const data = {
      exportDate: new Date().toISOString(),
      username: username,
      settings: {
        theme: theme,
        notifications: notifications
      },
      message: "Your Brainly data export",
      note: "This is your complete settings and preferences data"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainly-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Data exported successfully!");
  };

  
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const bgClass = isDark ? 'bg-slate-900' : 'bg-white';
  const textClass = isDark ? 'text-slate-100' : 'text-gray-900';
  const mutedTextClass = isDark ? 'text-slate-400' : 'text-gray-500';
  const borderClass = isDark ? 'border-slate-700' : 'border-gray-200';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${textClass}`}>Settings</h1>
        <p className={mutedTextClass}>Manage your account and application preferences</p>
      </div>

      
      <div className={`${cardBgClass} rounded-xl border ${borderClass} p-4 mb-6`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-sm ${textClass}`}>
            Current theme: <strong>{theme}</strong> 
            {theme === 'auto' && ` (${isDark ? 'Dark' : 'Light'} mode detected)`}
          </span>
        </div>
      </div>

     
      <div className="space-y-6">
        
        
        <div className={`${cardBgClass} rounded-xl border ${borderClass} p-6`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
          </h2>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
              <div>
                <h3 className={`font-medium ${textClass}`}>Username</h3>
                <p className={`text-sm ${mutedTextClass}`}>Your current username</p>
              </div>
              <span className={`text-sm ${textClass} ${isDark ? 'bg-slate-700' : 'bg-gray-100'} px-3 py-1 rounded-lg`}>
                {username}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className={`font-medium ${textClass}`}>Sign Out</h3>
                <p className={`text-sm ${mutedTextClass}`}>Sign out of your account</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="secondary" 
                text="Logout"
              />
            </div>
          </div>
        </div>

      
        <div className={`${cardBgClass} rounded-xl border ${borderClass} p-6`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
            </svg>
            Preferences
          </h2>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
              <div>
                <h3 className={`font-medium ${textClass}`}>Theme</h3>
                <p className={`text-sm ${mutedTextClass}`}>Choose your interface theme</p>
              </div>
              <select 
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className={`px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-slate-100' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="light">☀️ Light</option>
                <option value="dark">🌙 Dark</option>
                <option value="auto">🔄 Auto</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className={`font-medium ${textClass}`}>Notifications</h3>
                <p className={`text-sm ${mutedTextClass}`}>Receive updates and reminders</p>
              </div>
              <button
                onClick={handleNotificationsChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-purple-600' : isDark ? 'bg-slate-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        
        <div className={`${cardBgClass} rounded-xl border ${borderClass} p-6`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Data Management
          </h2>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
              <div>
                <h3 className={`font-medium ${textClass}`}>Export Data</h3>
                <p className={`text-sm ${mutedTextClass}`}>Download your content as JSON</p>
              </div>
              <Button 
                onClick={handleExportData}
                variant="secondary" 
                text="Export"
              />
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className={`font-medium ${textClass}`}>Storage Used</h3>
                <p className={`text-sm ${mutedTextClass}`}>Local browser storage</p>
              </div>
              <span className={`text-sm ${textClass}`}>
                ~{(JSON.stringify({theme, notifications, username}).length / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </div>

        
        <div className={`${cardBgClass} rounded-xl border ${borderClass} p-6`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className={mutedTextClass}>Version</span>
              <span className={`font-medium ${textClass}`}>1.0.0</span>
            </div>
            <div className="flex justify-between py-2">
              <span className={mutedTextClass}>Last Updated</span>
              <span className={`font-medium ${textClass}`}>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className={mutedTextClass}>Theme Status</span>
              <span className={`font-medium ${textClass}`}>
                {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
            </div>
            <div className={`pt-3 border-t ${borderClass}`}>
              <p className={`text-sm text-center ${mutedTextClass}`}>
                Built with ❤️ using React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}