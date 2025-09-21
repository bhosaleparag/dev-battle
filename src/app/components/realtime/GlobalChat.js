"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSocketContext } from '@/context/SocketProvider';

const GlobalChat = () => {
  const { chat, isConnected, user } = useSocketContext();
  const { globalMessages, sendGlobalMessage, getGlobalChatHistory, startTyping, stopTyping, typingUsers } = chat;
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (isConnected) {
      getGlobalChatHistory();
    }
  }, [isConnected, getGlobalChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [globalMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected || isLoading) return;

    setIsLoading(true);
    try {
      await sendGlobalMessage(message.trim());
      setMessage('');
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    startTyping();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const globalTypingUsers = typingUsers.filter(u => u.chatType === 'global');

  return (
    <div className="bg-white rounded-lg text-black shadow-lg flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Global Chat</h2>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {globalMessages.map((msg, idx) => (
          <div key={`${idx}-${msg?.id?._second}`} className={`flex ${msg.userId === user?.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.userId === user?.uid 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-900'
            }`}>
              {msg.userId !== user?.uid && (
                <div className="text-xs font-medium mb-1 opacity-75">
                  {msg.username}
                </div>
              )}
              <div className="text-sm">{msg.message}</div>
              <div className={`text-xs mt-1 ${
                msg.userId === user?.uid ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(msg.timestamp)}
                {msg.edited && ' (edited)'}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {globalTypingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700">
              <div className="text-xs">
                {globalTypingUsers.map(u => u.username).join(', ')} 
                {globalTypingUsers.length === 1 ? ' is' : ' are'} typing...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected || isLoading}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!isConnected || isLoading || !message.trim()}
            className={`px-6 py-2 rounded-lg font-medium ${
              isConnected && !isLoading && message.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlobalChat;
