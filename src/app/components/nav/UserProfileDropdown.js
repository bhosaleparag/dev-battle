// components/UserProfileDropdown.js
import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Trophy, 
  Users, 
  Bell,
  ChevronDown,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserProfileDropdown({ user, signOut, onOpenSettings, onOpenProfile, userStats }) {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    action();
  };

  const menuItems = [
    {
      icon: User,
      label: 'View Profile',
      action: () => onOpenProfile && onOpenProfile(),
      description: 'See your public profile'
    },
    {
      icon: Settings,
      label: 'Account Settings',
      action: () => onOpenSettings && onOpenSettings(),
      description: 'Manage your account'
    },
    {
      icon: Trophy,
      label: 'Achievements',
      action: () => router.push('achievements'),
      description: 'View your accomplishments'
    },
    {
      icon: Users,
      label: 'Friends',
      action: () => router.push('friends'),
      description: 'Manage your friend list'
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => router.push('notifications'),
      description: 'View recent activity'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => router.push('help'),
      description: 'Get help and support'
    },
    {
      icon: LogOut,
      label: 'Log Out',
      action: signOut,
      description: 'Sign out of your account',
      variant: 'danger'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-15 transition-colors group"
        aria-label="User menu"
      >
        <div className="relative">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-20 group-hover:border-purple-60 transition-colors"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-08 rounded-full"></div>
        </div>
        
        {/* Desktop: Show username and chevron */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="text-left">
            <div className="text-white text-sm font-medium">
              {user?.displayName || user?.username || 'User'}
            </div>
            <div className="text-gray-60 text-xs">
              Level {Math.floor((userStats?.totalScore || 0) / 100) + 1}
            </div>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-50 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-10 border border-gray-20 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-3 bg-gradient-to-r from-purple-60 to-purple-70 text-white">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                  <div className="font-semibold">
                    {user?.displayName || user?.username || 'User'}
                  </div>
                  <div className="text-purple-90 text-sm">
                    {user?.email}
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-purple-95">
                    <span>Level {Math.floor((userStats?.totalScore || 0) / 100) + 1}</span>
                    <span>•</span>
                    <span>{userStats?.battlesWon || 0} wins</span>
                    <span>•</span>
                    <span>{userStats?.streak || 0} streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-3 bg-gray-08 border-b border-gray-20">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-white font-semibold">{userStats?.quizzesTaken || 0}</div>
                  <div className="text-gray-60 text-xs">Quizzes</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{userStats?.battlesWon || 0}</div>
                  <div className="text-gray-60 text-xs">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{userStats?.streak || 0}</div>
                  <div className="text-gray-60 text-xs">Streak</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.action)}
                  className={`w-full flex items-center px-4 py-2 text-left transition-colors ${
                    item.variant === 'danger'
                      ? 'hover:bg-red-900/20 text-red-300 hover:text-red-200'
                      : 'hover:bg-gray-15 text-gray-50 hover:text-white'
                  } ${index === menuItems.length - 1 ? 'border-t border-gray-20 mt-2' : ''}`}
                >
                  <item.icon 
                    size={18} 
                    className={`mr-3 ${item.variant === 'danger' ? 'text-red-400' : 'text-gray-40'}`} 
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      item.variant === 'danger' ? 'text-red-400' : 'text-gray-60'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {item.label === 'Notifications' && (
                    <div className="w-2 h-2 bg-purple-60 rounded-full ml-2"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 bg-gray-08 border-t border-gray-20">
              <div className="flex items-center justify-between text-xs text-gray-60">
                <span>Dev Battle v1.0</span>
                <div className="flex items-center space-x-2">
                  <Shield size={12} />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Alternative Minimal Version (if you prefer simpler):
export function UserProfileDropdownMinimal({ user, signOut, onOpenSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
      >
        <img
          src={user?.avatar || '/default-avatar.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-20 group-hover:border-purple-60 transition-colors"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-08 rounded-full"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-10 border border-gray-20 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-20">
            <div className="text-white font-medium truncate">
              {user?.displayName || user?.username || 'User'}
            </div>
            <div className="text-gray-60 text-sm truncate">
              {user?.email}
            </div>
          </div>
          
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings && onOpenSettings();
              }}
              className="w-full flex items-center px-3 py-2 text-gray-50 hover:bg-gray-15 hover:text-white transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Account Settings
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center px-3 py-2 text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Usage Examples:

// Full Featured Version:
<UserProfileDropdown 
  user={user}
  signOut={signOut}
  onOpenSettings={() => setShowSettings(true)}
  onOpenProfile={() => setShowProfile(true)}
  userStats={user?.stats}
/>

// Minimal Version:
<UserProfileDropdownMinimal 
  user={user}
  signOut={signOut}
  onOpenSettings={() => setShowSettings(true)}
/>
*/