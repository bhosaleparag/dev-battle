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
import Image from 'next/image';
import { calculateLevel } from '@/utils/calculateLevel';
import { SoundButton } from '../ui/SoundButton';
import Avatar from '../ui/Avatar';

export default function UserProfileDropdown({ user, signOut, onOpenSettings, onOpenProfile, userStats }) {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const userStat = calculateLevel(user?.stats?.xp)

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
      action: () => router.push(`/user/${user?.uid}`),
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
      action: () => router.push('/achievements'),
      description: 'View your accomplishments'
    },
    {
      icon: Users,
      label: 'Friends',
      action: () => router.push('/friends'),
      description: 'Manage your friend list'
    },
    // {
    //   icon: Bell,
    //   label: 'Notifications',
    //   action: () => router.push('/notifications'),
    //   description: 'View recent activity'
    // },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => router.push('/help'),
      description: 'Get help and support'
    },
    {
      icon: LogOut,
      label: 'Log Out',
      action: ()=>{
        signOut();
        router.push('/');
      },
      description: 'Sign out of your account',
      variant: 'danger'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <SoundButton
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-15 transition-colors group"
        aria-label="User menu"
      >
        <Avatar
          src={user?.avatar}
          alt={user.username}
          status={'online'}
          fallbackText={user.username?.charAt(0)?.toUpperCase()}
        />
        
        {/* Desktop: Show username and chevron */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="text-left">
            <div className="text-white text-sm font-medium">
              {user?.displayName || user?.username || 'User'}
            </div>
            <div className="text-gray-60 text-xs">
              Level {userStat.level}
            </div>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-50 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </SoundButton>

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
                <Avatar
                  src={user?.avatar}
                  alt={user.username}
                  status={'online'}
                  fallbackText={user.username?.charAt(0)?.toUpperCase()}
                />
                <div className="flex-1">
                  <div className="font-semibold">
                    {user?.displayName || user?.username || 'User'}
                  </div>
                  <div className="text-purple-90 text-sm">
                    {user?.email}
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-purple-95">
                    <span>Level {userStat.level}</span>
                    <span>•</span>
                    <span>{userStats?.battlesWon || 0} wins</span>
                    <span>•</span>
                    <span>{userStats?.streak || 0} streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <SoundButton
                  soundEffect='swipe'
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
                </SoundButton>
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