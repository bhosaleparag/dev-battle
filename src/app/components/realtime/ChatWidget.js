"use client";
import { useEffect, useState, useRef } from 'react';
import { X, Send, MessageCircle,Edit3,Trash2,Check,Globe } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { useSocketContext } from '@/context/SocketProvider';

const ChatWidget = ({ chatType='global', roomId=null, title='Global Chat', isOpen = false, onClose }) => {
  const { user } = useAuth();
  const { chatState, isConnected } = useSocketContext();
  const { globalMessages, roomMessages, typingUsers, sendGlobalMessage, sendRoomMessage, getGlobalChatHistory, getRoomChatHistory, editMessage, deleteMessage, startTyping, stopTyping } = chatState;
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get appropriate messages and functions based on chat type
  const messages = chatType === 'global' ? globalMessages : (roomMessages[roomId] || []);
  const sendMessage = chatType === 'global' ? sendGlobalMessage : sendRoomMessage;
  const getChatHistory = chatType === 'global' ? getGlobalChatHistory : getRoomChatHistory;

  useEffect(() => {
    if (isConnected && isOpen) {
      if (chatType === 'global') {
        getChatHistory();
      } else if (roomId) {
        getChatHistory(roomId);
      }
    }
  }, [isConnected, isOpen, roomId, chatType, getChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected || isLoading) return;

    setIsLoading(true);
    try {
      if (chatType === 'global') {
        await sendMessage(message.trim());
      } else {
        await sendMessage(roomId, message.trim());
      }
      setMessage('');
      stopTyping(roomId, chatType);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    startTyping(roomId, chatType);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(roomId, chatType);
    }, 1000);
  };

  const handleEditMessage = async (messageId, newText) => {
    if (!newText.trim()) return;
    
    try {
      await editMessage(messageId, newText.trim(), chatType);
      setEditingMessage(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId, chatType);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const currentTypingUsers = typingUsers.filter(u => 
    u.chatType === chatType && (chatType === 'global' || u.roomId === roomId)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-gray-08 border border-gray-20 rounded-2xl shadow-2xl flex flex-col h-[32rem] z-50 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-60/20 to-purple-70/20 border-b border-gray-20 p-4">
        <div className="absolute inset-0 bg-gray-10/80 backdrop-blur-sm" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-60/20 rounded-xl">
              {chatType === 'global' ? (
                <Globe size={18} className="text-purple-60" />
              ) : (
                <MessageCircle size={18} className="text-purple-60" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white-99">{title}</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-50">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-15 rounded-lg transition-all duration-200 text-gray-50 hover:text-white-99"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-gray-15 scrollbar-thumb-gray-30">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-15 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle size={24} className="text-gray-40" />
            </div>
            <p className="text-gray-50 text-sm">No messages yet</p>
            <p className="text-gray-60 text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.userId === user?.uid;
            const isEditing = editingMessage === msg.id;
            
            return (
              <div key={`${idx}-${msg?.id?._second || msg.id}`} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    isOwn 
                      ? 'bg-purple-60 text-white rounded-br-md' 
                      : 'bg-gray-15 text-white-99 rounded-bl-md'
                  }`}>
                    {!isOwn && (
                      <div className="text-xs font-medium mb-2 opacity-75 text-purple-60">
                        {msg.username}
                      </div>
                    )}
                    
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-gray-20 text-white-99 px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-60"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditMessage(msg.id, editText);
                            } else if (e.key === 'Escape') {
                              setEditingMessage(null);
                              setEditText('');
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMessage(msg.id, editText)}
                            className="p-1 hover:bg-gray-20 rounded text-green-400"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText('');
                            }}
                            className="p-1 hover:bg-gray-20 rounded text-red-400"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm leading-relaxed">{msg.message}</div>
                        <div className={`text-xs mt-2 flex items-center gap-1 ${
                          isOwn ? 'text-purple-200' : 'text-gray-50'
                        }`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {msg.edited && <span>(edited)</span>}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  {isOwn && !isEditing && (
                    <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1 bg-gray-10 border border-gray-20 rounded-lg p-1">
                        <button
                          onClick={() => {
                            setEditingMessage(msg.id);
                            setEditText(msg.message);
                          }}
                          className="p-1 hover:bg-gray-15 rounded text-gray-50 hover:text-white-99"
                          title="Edit"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 hover:bg-gray-15 rounded text-gray-50 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {currentTypingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-15 px-4 py-2 rounded-2xl rounded-bl-md">
              <div className="text-xs text-gray-50 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-gray-50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-gray-50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>
                  {currentTypingUsers.map(u => u.username).join(', ')} 
                  {currentTypingUsers.length === 1 ? ' is' : ' are'} typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-20 bg-gray-10/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-gray-15 border border-gray-20 rounded-xl text-white-99 placeholder-gray-50 focus:outline-none focus:border-purple-60 focus:ring-1 focus:ring-purple-60/20 transition-all duration-200"
              disabled={!isConnected || isLoading}
              maxLength={1000}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isConnected || isLoading || !message.trim()}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              isConnected && !isLoading && message.trim()
                ? 'bg-purple-60 hover:bg-purple-65 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-20 text-gray-50 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;