"use client";

import { Check, Clock, Crown, MessageCircle, MoreVertical, Shield, User, UserMinus, UserPlus, X, Zap } from "lucide-react";
import { useState } from "react";
import Avatar from "./Avatar";
import ChatWidget from "../realtime/ChatWidget";

const FriendMenu = ({ 
  isOpen, 
  onClose, 
  context, // 'friend', 'request', 'search'
  onViewProfile,
  onChat,
  onRemoveFriend,
  onAcceptRequest,
  onDeclineRequest,
  onSendRequest
}) => {
  if (!isOpen) return null;

  const menuItems = {
    friend: [
      { icon: User, label: 'View Profile', onClick: onViewProfile },
      { icon: MessageCircle, label: 'Start Chat', onClick: onChat },
      { icon: Zap, label: 'Challenge', onClick: () => console.log('Challenge friend') },
      { icon: UserMinus, label: 'Remove Friend', onClick: onRemoveFriend, destructive: true }
    ],
    request: [
      { icon: Check, label: 'Accept', onClick: onAcceptRequest },
      { icon: X, label: 'Decline', onClick: onDeclineRequest, destructive: true }
    ],
    search: [
      { icon: UserPlus, label: 'Send Request', onClick: onSendRequest }
    ]
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-44 bg-gray-08 border border-gray-20 rounded-xl shadow-xl z-20 overflow-hidden backdrop-blur-lg">
      <div className="py-1">
        {menuItems[context]?.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-gray-15 transition-all duration-200 ${
              item.destructive ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-white-95'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const FriendBar = ({ 
  friend,
  context = 'friend', // 'friend', 'request', 'search'
  onClick,
  onViewProfile,
  onRemoveFriend,
  onAcceptRequest,
  onDeclineRequest,
  onSendRequest
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      online: { color: 'bg-green-500', text: 'Online', pulse: true },
      offline: { color: 'bg-gray-40', text: 'Offline', pulse: false },
      away: { color: 'bg-yellow-500', text: 'Away', pulse: false },
      busy: { color: 'bg-red-500', text: 'Busy', pulse: false }
    };
    return badges[status] || badges.offline;
  };

  const getRankIcon = (rank) => {
    const icons = {
      pro: { icon: Crown, color: 'text-yellow-400' },
      expert: { icon: Shield, color: 'text-purple-60' },
      beginner: { icon: User, color: 'text-gray-50' }
    };
    return icons[rank] || icons.beginner;
  };

  const statusBadge = getStatusBadge(friend.status);
  const rankIcon = getRankIcon(friend.rank);

  const getContextButton = () => {
    switch (context) {
      case 'request':
        return (
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAcceptRequest();
              }}
              className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium min-w-0"
              title="Accept"
            >
              <Check size={12} className="sm:hidden" />
              <Check size={14} className="hidden sm:block" />
              <span className="hidden sm:inline">Accept</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeclineRequest();
              }}
              className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium min-w-0"
              title="Decline"
            >
              <X size={12} className="sm:hidden" />
              <X size={14} className="hidden sm:block" />
              <span className="hidden sm:inline">Decline</span>
            </button>
          </div>
        );
      case 'search':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSendRequest();
            }}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-60 hover:bg-purple-65 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shrink-0"
            title="Send Friend Request"
          >
            <UserPlus size={12} className="sm:hidden" />
            <UserPlus size={14} className="hidden sm:block" />
            <span className="hidden sm:inline">Add</span>
          </button>
        );
      default:
        return (
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-15 rounded-lg transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
            >
              <MoreVertical size={16} className="text-gray-50" />
            </button>
            <FriendMenu
              isOpen={showMenu}
              onClose={() => setShowMenu(false)}
              context={context}
              onViewProfile={onViewProfile}
              onChat={()=>setChatOpen(prev=>!prev)}
              onRemoveFriend={onRemoveFriend}
            />
          </div>
        );
    }
  };

  return (
    <div
      className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-15/50 active:bg-gray-15/70 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-20/50 touch-manipulation"
      onClick={onClick}
    >
      <div className="relative shrink-0">
        <Avatar
          src={friend.avatar}
          alt={friend.name}
          size={40} // Smaller on mobile
          className="sm:w-12 sm:h-12" // Larger on desktop
          status={friend.status}
          fallbackText={friend.name?.charAt(0)?.toUpperCase()}
        />
        {context === 'request' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-purple-60 rounded-full flex items-center justify-center">
            <UserPlus size={8} className="sm:hidden text-white" />
            <UserPlus size={10} className="hidden sm:block text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h3 className="font-semibold text-white-99 truncate text-sm sm:text-base">{friend.name}</h3>
          <rankIcon.icon size={12} className={`${rankIcon.color} sm:w-3.5 sm:h-3.5 shrink-0`} />
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <span className="text-gray-50 truncate">@{friend.username}</span>
          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-50 rounded-full shrink-0" />
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${statusBadge.color} rounded-full`} />
            <span className="text-gray-50 hidden sm:inline">{statusBadge.text}</span>
            <span className="text-gray-50 sm:hidden">{statusBadge.text.charAt(0)}</span>
          </div>
          {friend.level && (
            <>
              <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-50 rounded-full shrink-0" />
              <span className="text-gray-50 shrink-0">
                <span className="hidden sm:inline">Level </span>
                <span className="sm:hidden">L</span>
                {friend.level}
              </span>
            </>
          )}
        </div>

        {context === 'request' && (
          <p className="text-xs sm:text-sm text-purple-60 font-medium flex items-center gap-1">
            <Clock size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Wants to be friends</span>
            <span className="sm:hidden">Friend request</span>
          </p>
        )}
      </div>

      <ChatWidget
        isOpen={chatOpen}
        onClose={()=>setChatOpen(false)}
      />

      {getContextButton()}
    </div>
  );
};
export default FriendBar;