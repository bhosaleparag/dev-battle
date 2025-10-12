"use client";
import React, { useEffect, useState } from 'react';
import { useSocketContext } from '@/context/SocketProvider';
import { SoundButton } from '../ui/SoundButton';

const RoomList = () => {
  const { rooms, isConnected } = useSocketContext();
  const { availableRooms, getAvailableRooms, createRoom, joinRoom } = rooms;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: '',
    type: 'public',
    maxPlayers: 4
  });

  useEffect(() => {
    if (isConnected) {
      getAvailableRooms();
      // Refresh every 10 seconds
      const interval = setInterval(() => {
        getAvailableRooms();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected, getAvailableRooms]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.name.trim()) return;

    try {
      await createRoom(
        roomForm.name.trim(),
        roomForm.type,
        roomForm.maxPlayers,
        {}
      );
      setRoomForm({ name: '', type: 'public', maxPlayers: 4 });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Available Rooms</h2>
        <SoundButton
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          disabled={!isConnected}
        >
          Create Room
        </SoundButton>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                type="text"
                value={roomForm.name}
                onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter room name..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Players
                </label>
                <select
                  value={roomForm.maxPlayers}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2 Players</option>
                  <option value={4}>4 Players</option>
                  <option value={6}>6 Players</option>
                  <option value={8}>8 Players</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <SoundButton
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Room
              </SoundButton>
              <SoundButton
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </SoundButton>
            </div>
          </form>
        </div>
      )}

      {/* Rooms List */}
      <div className="space-y-3">
        {availableRooms.map(room => (
          <div key={room.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    room.type === 'public' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.type}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Players: {room.currentPlayers}/{room.maxPlayers}</div>
                  <div>Created by: {room.creatorUsername}</div>
                  <div>Created: {new Date(room.createdAt).toLocaleTimeString()}</div>
                </div>
                
                {room.participantDetails && room.participantDetails.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Players:</div>
                    <div className="flex flex-wrap gap-1">
                      {room.participantDetails.map(participant => (
                        <span 
                          key={participant.userId}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {participant.username}
                          {participant.isReady && ' ✓'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                <SoundButton
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={!isConnected || room.currentPlayers >= room.maxPlayers}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isConnected && room.currentPlayers < room.maxPlayers
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.currentPlayers >= room.maxPlayers ? 'Full' : 'Join'}
                </SoundButton>
              </div>
            </div>
          </div>
        ))}
        
        {availableRooms.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No rooms available. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;