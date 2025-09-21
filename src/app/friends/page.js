"use client";
import { useState } from 'react';
import { 
  Search,
  UserPlus,
  Check,
  X,
  MoreVertical,
  MessageCircle,
  User,
  Clock,
  Bell,
  ThumbsUp
} from 'lucide-react';
import Typography from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Dialog';
import Image from 'next/image';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  const tabs = [
    { id: 'friends', name: 'Friends', count: 12 },
    { id: 'requests', name: 'Friend Requests', count: 3 },
    { id: 'suggestions', name: 'Suggestions', count: 8 }
  ];

  const friends = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarah_j',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c4b0e596?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastSeen: 'Active now',
      mutualFriends: 5,
      level: 8,
      joinedDate: '2023-03-15'
    },
    {
      id: 2,
      name: 'Mike Chen',
      username: '@mike_chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'offline',
      lastSeen: '2 hours ago',
      mutualFriends: 8,
      level: 12,
      joinedDate: '2023-01-20'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      username: '@emily_r',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      status: 'away',
      lastSeen: '30 minutes ago',
      mutualFriends: 3,
      level: 6,
      joinedDate: '2023-05-10'
    },
    {
      id: 4,
      name: 'David Kim',
      username: '@david_kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastSeen: 'Active now',
      mutualFriends: 12,
      level: 15,
      joinedDate: '2022-11-05'
    },
    {
      id: 5,
      name: 'Jessica Brown',
      username: '@jess_brown',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      status: 'offline',
      lastSeen: '1 day ago',
      mutualFriends: 7,
      level: 9,
      joinedDate: '2023-02-14'
    },
    {
      id: 6,
      name: 'Alex Thompson',
      username: '@alex_t',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      status: 'away',
      lastSeen: '45 minutes ago',
      mutualFriends: 11,
      level: 13,
      joinedDate: '2022-12-08'
    }
  ];

  const friendRequests = [
    {
      id: 7,
      name: 'Lisa Park',
      username: '@lisa_park',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 2,
      requestDate: '2024-09-13'
    },
    {
      id: 8,
      name: 'James Wilson',
      username: '@james_w',
      avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 7,
      requestDate: '2024-09-12'
    },
    {
      id: 9,
      name: 'Robert Martinez',
      username: '@rob_m',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 1,
      requestDate: '2024-09-11'
    }
  ];

  const suggestions = [
    {
      id: 10,
      name: 'Maria Garcia',
      username: '@maria_g',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 9,
      reason: 'Works at the same company'
    },
    {
      id: 11,
      name: 'Chris Anderson',
      username: '@chris_a',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 4,
      reason: 'Mutual friends with Sarah Johnson'
    },
    {
      id: 12,
      name: 'Amy Taylor',
      username: '@amy_t',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 6,
      reason: 'Similar interests'
    },
    {
      id: 13,
      name: 'Daniel Lee',
      username: '@daniel_l',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 3,
      reason: 'Lives in your city'
    },
    {
      id: 14,
      name: 'Sophie Williams',
      username: '@sophie_w',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      mutualFriends: 8,
      reason: 'Common interests'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = (requestId) => {
    // Handle accept friend request logic
    console.log('Accepting request:', requestId);
  };

  const handleDeclineRequest = (requestId) => {
    // Handle decline friend request logic
    console.log('Declining request:', requestId);
  };

  const handleAddFriend = (suggestionId) => {
    // Handle add friend logic
    console.log('Adding friend:', suggestionId);
  };

  const handleRemoveSuggestion = (suggestionId) => {
    // Handle remove suggestion logic
    console.log('Removing suggestion:', suggestionId);
  };

  const handleSendFriendRequest = () => {
    // Handle send friend request logic
    setShowAddFriend(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <Typography variant='h1' className="mb-2">Friends</Typography>
            <p className="text-gray-60">Connect with your friends and discover new people</p>
          </div>
          <button
            onClick={() => setShowAddFriend(true)}
            className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition duration-200"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Friend
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-15 space-x-1 p-1 rounded-lg mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-50 hover:text-white-90'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="rounded-lg shadow-sm p-6 border border-gray-15 hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}></div>
                    </div>
                    <div>
                      <Typography className="text-lg font-semibold">{friend.name}</Typography>
                      <p className="text-gray-600">{friend.username}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {friend.lastSeen}
                        </span>
                        <span className="text-sm text-gray-500">
                          Level {friend.level}
                        </span>
                        <span className="text-sm text-gray-500">
                          {friend.mutualFriends} mutual friends
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredFriends.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No friends found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Start by adding some friends!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div key={request.id} className="rounded-lg shadow-sm p-6 border border-gray-15 hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={request.avatar}
                      alt={request.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <Typography className="text-lg font-semibold">{request.name}</Typography>
                      <p className="text-gray-600">{request.username}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {request.mutualFriends} mutual friends
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition duration-200"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDeclineRequest(request.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center transition duration-200"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {friendRequests.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No friend requests</h3>
                <p className="text-gray-600">You're all caught up with friend requests!</p>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-lg shadow-sm p-6 border border-gray-15 hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={suggestion.avatar}
                      alt={suggestion.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <Typography className="text-lg font-semibold">{suggestion.name}</Typography>
                      <p className="text-gray-600">{suggestion.username}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {suggestion.mutualFriends} mutual friends
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleAddFriend(suggestion.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Friend
                    </button>
                    <button 
                      onClick={() => handleRemoveSuggestion(suggestion.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center transition duration-200"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {suggestions.length === 0 && (
              <div className="text-center py-12">
                <ThumbsUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
                <p className="text-gray-600">We'll suggest new friends based on your activity!</p>
              </div>
            )}
          </div>
        )}

      <Modal open={showAddFriend} onClose={() => setShowAddFriend(false)} title="Add Friend">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Username or Email
            </label>
            <Input
              type="text"
              placeholder="Enter username or email"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddFriend(false)}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSendFriendRequest}
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
            >
              Send Request
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default Friends;