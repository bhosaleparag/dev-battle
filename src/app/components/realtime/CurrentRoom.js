"use client";
// components/CurrentRoom.js - Current Room Component
import React, { useState, useEffect } from 'react';
import { useSocketContext } from '@/context/SocketProvider';
import { SoundButton } from '../ui/SoundButton';

const CurrentRoom = () => {
  const { rooms, chat, isConnected, user } = useSocketContext();
  const { currentRoom, leaveRoom, toggleReady, emitGameEvent } = rooms;
  const { roomMessages, sendRoomMessage, getRoomChatHistory } = chat;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentRoom && isConnected) {
      getRoomChatHistory(currentRoom.id);
    }
  }, [currentRoom, isConnected, getRoomChatHistory]);

  if (!currentRoom) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          You are not in any room. Join or create a room to get started.
        </div>
      </div>
    );
  }

  const myParticipant = currentRoom.participantDetails?.find(p => p.userId === user?.uid);
  const currentMessages = roomMessages[currentRoom.id] || [];

  const handleLeaveRoom = () => {
    leaveRoom(currentRoom.id);
  };

  const handleToggleReady = () => {
    toggleReady(currentRoom.id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    sendRoomMessage(currentRoom.id, message.trim());
    setMessage('');
  };

  const handleGameEvent = (eventType, eventData) => {
    emitGameEvent(currentRoom.id, eventType, eventData);
  };

  const allPlayersReady = currentRoom.participantDetails?.every(p => p.isReady) && currentRoom.participantDetails?.length >= 2;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Room Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentRoom.name}</h2>
            <p className="text-gray-600">
              {currentRoom.currentPlayers}/{currentRoom.maxPlayers} players • {currentRoom.status}
            </p>
          </div>
          <SoundButton
            onClick={handleLeaveRoom}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Leave Room
          </SoundButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Players Panel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Players</h3>
            {currentRoom.status === 'waiting' && (
              <SoundButton
                onClick={handleToggleReady}
                className={`px-4 py-2 rounded-lg font-medium ${
                  myParticipant?.isReady 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {myParticipant?.isReady ? 'Ready ✓' : 'Ready?'}
              </SoundButton>
            )}
          </div>

          <div className="space-y-3">
            {currentRoom.participantDetails?.map(participant => (
              <div 
                key={participant.userId} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  participant.userId === user?.uid ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    participant.isReady ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <div className="font-medium">
                      {participant.username}
                      {participant.userId === user?.uid && ' (You)'}
                      {participant.userId === currentRoom.createdBy && ' 👑'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Score: {participant.score || 0}
                    </div>
                  </div>
                </div>
                
                {participant.isReady && (
                  <span className="text-green-600 font-medium">Ready</span>
                )}
              </div>
            ))}
          </div>

          {allPlayersReady && currentRoom.status === 'waiting' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 font-medium">
                All players ready! Game starting soon...
              </div>
            </div>
          )}

          {/* Game Controls */}
          {currentRoom.status === 'playing' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-3">Game Controls</h4>
              <div className="space-y-2">
                <SoundButton
                  onClick={() => handleGameEvent('bug-solved', { points: 10 })}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Solve Bug (+10 points)
                </SoundButton>
                <SoundButton
                  onClick={() => handleGameEvent('timer-update', { timeRemaining: 300 })}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Update Timer
                </SoundButton>
              </div>
            </div>
          )}
        </div>

        {/* Room Chat */}
        <div className="flex flex-col h-80">
          <h3 className="text-lg font-semibold mb-4">Room Chat</h3>
          
          <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2">
            {currentMessages.map(msg => (
              <div key={`${idx}-${msg?.id?._second}`} className={`text-sm ${
                msg.userId === user?.uid ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block max-w-xs px-3 py-2 rounded-lg ${
                  msg.userId === user?.uid 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-900'
                }`}>
                  {msg.userId !== user?.uid && (
                    <div className="font-medium text-xs opacity-75 mb-1">
                      {msg.username}
                    </div>
                  )}
                  <div>{msg.message}</div>
                  <div className={`text-xs mt-1 opacity-75`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {currentMessages.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="mt-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isConnected}
                maxLength={1000}
              />
              <SoundButton
                type="submit"
                disabled={!isConnected || !message.trim()}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isConnected && message.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send
              </SoundButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CurrentRoom;