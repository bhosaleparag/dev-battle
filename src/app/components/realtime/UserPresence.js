"use client";
import { useSocketContext } from '@/context/SocketProvider';
import { useEffect, useState } from 'react';
import { SoundButton } from '../ui/SoundButton';

const UserPresence = () => {
  const { presence, isConnected } = useSocketContext();
  const { onlineUsers, myPresence, updatePresence, getOnlineUsers } = presence;
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    if (isConnected) {
      getOnlineUsers();
    }
  }, [isConnected, getOnlineUsers]);

  const handleStatusChange = (status) => {
    updatePresence(status, myPresence.customMessage);
  };

  const handleCustomMessageSubmit = (e) => {
    e.preventDefault();
    updatePresence(myPresence.status, customMessage);
    setShowCustomMessage(false);
    setCustomMessage('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Online Users ({onlineUsers.length})</h2>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>

      {/* My Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Your Status:</span>
          <div className="flex space-x-2">
            {['online', 'idle', 'away'].map(status => (
              <SoundButton
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  myPresence.status === status 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SoundButton>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(myPresence.status)}`}></div>
          <span className="text-sm text-gray-600">
            {myPresence.customMessage || 'No custom message'}
          </span>
          <SoundButton
            onClick={() => setShowCustomMessage(!showCustomMessage)}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            Edit
          </SoundButton>
        </div>

        {showCustomMessage && (
          <form onSubmit={handleCustomMessageSubmit} className="mt-2">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter custom message..."
              className="w-full px-3 py-1 border rounded text-sm"
              maxLength={100}
            />
            <div className="flex space-x-2 mt-2">
              <SoundButton
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Save
              </SoundButton>
              <SoundButton
                type="button"
                onClick={() => {
                  setShowCustomMessage(false);
                  setCustomMessage('');
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
              >
                Cancel
              </SoundButton>
            </div>
          </form>
        )}
      </div>

      {/* Online Users List */}
      <div className="space-y-3">
        {onlineUsers.map(user => (
          <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{user.username}</div>
              {user.customMessage && (
                <div className="text-sm text-gray-500">{user.customMessage}</div>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {user.lastActivity ? new Date(user.lastActivity).toLocaleTimeString() : 'Just now'}
            </div>
          </div>
        ))}
        
        {onlineUsers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No users online
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPresence;