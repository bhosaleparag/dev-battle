"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from './hooks/useAuth';
import UserPresence from './components/realtime/UserPresence';
import GlobalChat from './components/realtime/GlobalChat';
import RoomList from './components/realtime/RoomList';
import CurrentRoom from './components/realtime/CurrentRoom';
import Leaderboard from './leaderboard/Leaderboard';
import { useSocketContext } from './context/SocketProvider';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('rooms');
  const {user} = useAuth();
  const { isConnected, connectionError, reconnectAttempts, reconnect, currentRoom } = useSocketContext();

  // Auto-switch to current room tab when user joins a room
  useEffect(() => {
    if (currentRoom) {
      setActiveTab('current-room');
    }
  }, [currentRoom]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to continue.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'rooms', label: 'Rooms', icon: '🏠' },
    { id: 'chat', label: 'Global Chat', icon: '💬' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'presence', label: 'Online Users', icon: '👥' }
  ];

  // Add current room tab if user is in a room
  if (currentRoom) {
    tabs.splice(1, 0, { id: 'current-room', label: 'Current Room', icon: '🎮' });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🎮 Realtime Gaming Platform
              </h1>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {reconnectAttempts > 0 && (
                  <span className="text-xs text-gray-500">
                    (Reconnect attempts: {reconnectAttempts})
                  </span>
                )}
              </div>

              {connectionError && (
                <button
                  onClick={reconnect}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Reconnect
                </button>
              )}

              <div className="text-sm text-gray-600">
                Welcome, {user.displayName || user.email || `User ${user.uid.slice(-4)}`}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Connection Error: {connectionError}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'current-room' && currentRoom && (
                      <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {currentRoom.currentPlayers}/{currentRoom.maxPlayers}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      isConnected ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  {currentRoom && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span className="font-medium text-blue-600">
                          {currentRoom.name.slice(0, 12)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Players:</span>
                        <span className="font-medium">
                          {currentRoom.currentPlayers}/{currentRoom.maxPlayers}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'rooms' && <RoomList />}
            {activeTab === 'current-room' && <CurrentRoom />}
            {activeTab === 'chat' && <GlobalChat />}
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'presence' && <UserPresence />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Realtime Gaming Platform powered by Socket.IO, Next.js, and Firebase
            </p>
            <div className="mt-2 flex items-center justify-center space-x-4">
              <span>Server: {isConnected ? '🟢 Online' : '🔴 Offline'}</span>
              <span>•</span>
              <span>User ID: {user.uid.slice(-8)}</span>
              {reconnectAttempts > 0 && (
                <>
                  <span>•</span>
                  <span>Reconnecting... ({reconnectAttempts}/5)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}