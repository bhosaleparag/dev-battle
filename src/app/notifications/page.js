// components/Notifications.jsx
"use client";
import { useState } from 'react';
import { 
  Bell,
  Check,
  X,
  MoreVertical,
  Trophy,
  Heart,
  MessageSquare,
  AlertTriangle,
  Info,
  Settings,
  Trash
} from "lucide-react";
import Typography from '@/components/ui/Typography';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import Image from 'next/image';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'friend_request',
      title: 'New Friend Request',
      message: 'Sarah Johnson sent you a friend request',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c4b0e596?w=150&h=150&fit=crop&crop=face',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      actionable: true
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Speed Demon" achievement',
      icon: Trophy,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 3,
      type: 'like',
      title: 'Post Liked',
      message: 'Mike Chen and 5 others liked your post',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      icon: Heart,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Emily Rodriguez: "Hey, how are you doing?"',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      icon: MessageSquare,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New features are now available. Check them out!',
      icon: Info,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 6,
      type: 'warning',
      title: 'Account Security',
      message: 'New login detected from Chrome on Windows',
      icon: AlertTriangle,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ]);

  const [settings, setSettings] = useState({
    friendRequests: true,
    achievements: true,
    likes: true,
    messages: true,
    system: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const [showSettings, setShowSettings] = useState(false);

  const filterOptions = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'friend_request', name: 'Friend Requests', count: notifications.filter(n => n.type === 'friend_request').length },
    { id: 'achievement', name: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
    { id: 'message', name: 'Messages', count: notifications.filter(n => n.type === 'message').length }
  ];

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (notification) => {
    if (notification.avatar) {
      return (
        <Image
          src={notification.avatar}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    
    const IconComponent = notification.icon;
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.bgColor || 'bg-gray-100'}`}>
        <IconComponent className={`w-5 h-5 ${notification.color || 'text-gray-500'}`} />
      </div>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center">
            <div className="relative mr-4">
              <Bell className="w-8 h-8 fill-current text-blue-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <Typography variant='h1'>Notifications</Typography>
              <p className="text-gray-30">Stay updated with your latest activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition duration-200 disabled:text-gray-40 disabled:hover:bg-transparent"
            >
              Mark all read
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-40 hover:text-gray-30 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === option.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-08 text-white-99 hover:bg-gray-100 hover:text-gray-15 border border-gray-300'
              }`}
            >
              {option.name} ({option.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {getFilteredNotifications().map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg shadow-sm border p-4 transition-all duration-200 hover:shadow-md ${
                !notification.read ? 'border-gray-40' : 'border-gray-15'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-white-99' : 'text-white-95'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-30 text-sm mb-2">{notification.message}</p>
                    <p className="text-gray-40 text-xs">{getTimeAgo(notification.timestamp)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {notification.actionable && (
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200">
                        Accept
                      </button>
                      <button className="bg-gray-15 hover:bg-gray-30 text-white px-3 py-1 rounded text-sm font-medium transition duration-200">
                        Decline
                      </button>
                    </div>
                  )}
                  
                  <div className="relative">
                    <button className="p-1 text-gray-40 hover:text-gray-30 rounded transition duration-200">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {/* Dropdown menu would go here */}
                  </div>
                  
                  <button
                    onClick={() => !notification.read ? markAsRead(notification.id) : deleteNotification(notification.id)}
                    className="p-1 text-gray-40 hover:text-gray-30 rounded transition duration-200"
                  >
                    {!notification.read ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredNotifications().length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-gray-30">
              {filter === 'all' 
                ? "You're all caught up!" 
                : `No ${filter === 'unread' ? 'unread' : filter.replace('_', ' ')} notifications.`}
            </p>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant='h4' className="font-semibold">Notification Settings</Typography>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-40 hover:text-gray-30"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-15 pb-4">
                  <h4 className="font-medium mb-3">Notification Types</h4>
                  {Object.entries(settings).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <span className="text-gray-60 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                        <ToggleSwitch
                          id={`toggle-${key}`}
                          checked={value}
                          onChange={(val) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                        />
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Delivery Methods</h4>
                  {Object.entries(settings).slice(5).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <span className="text-gray-60 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, [key]: !value }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-15">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;