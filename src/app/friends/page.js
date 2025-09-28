"use client";
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search,
  Clock,
  UserCheck,
} from 'lucide-react';
import Modal from '@/components/ui/Dialog';
import SearchField from '@/explore/components/SearchField';
import FriendBar from '@/components/ui/FriendBar';

// Tab Button Component
const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
      active 
        ? 'bg-purple-60 text-white shadow-lg shadow-purple-60/20' 
        : 'text-gray-50 hover:text-white-95 hover:bg-gray-15'
    }`}
  >
    {children}
    {count > 0 && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
        active ? 'bg-white/20 text-white' : 'bg-gray-20 text-gray-50'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// FriendsList Component (Main Wrapper)
const FriendsList = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['john_doe', 'jane_smith']);

  // Mock data - replace with your actual data
  const [friends] = useState([
    {
      id: 1,
      name: 'John Doe',
      username: 'john_doe',
      avatar: null,
      status: 'online',
      rank: 'expert',
      level: 42,
      isOnline: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'jane_smith',
      avatar: null,
      status: 'away',
      rank: 'pro',
      level: 58,
      isOnline: true
    },
    {
      id: 3,
      name: 'Bob Wilson',
      username: 'bob_w',
      avatar: null,
      status: 'offline',
      rank: 'beginner',
      level: 12,
      isOnline: false
    },
    {
      id: 8,
      name: 'Emma Davis',
      username: 'emma_d',
      avatar: null,
      status: 'busy',
      rank: 'expert',
      level: 35,
      isOnline: true
    }
  ]);

  const [friendRequests] = useState([
    {
      id: 4,
      name: 'Alice Johnson',
      username: 'alice_j',
      avatar: null,
      status: 'online',
      rank: 'pro',
      level: 28,
      isOnline: true
    },
    {
      id: 5,
      name: 'Mike Brown',
      username: 'mike_b',
      avatar: null,
      status: 'offline',
      rank: 'beginner',
      level: 8,
      isOnline: false
    }
  ]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    // Mock search results - replace with actual search logic
    setSearchResults([
      {
        id: 6,
        name: 'Sarah Connor',
        username: 'sarah_c',
        avatar: null,
        status: 'online',
        rank: 'expert',
        level: 67,
        isOnline: true
      },
      {
        id: 7,
        name: 'Tom Anderson',
        username: 'neo',
        avatar: null,
        status: 'busy',
        rank: 'pro',
        level: 89,
        isOnline: true
      }
    ]);
  };

  const handleFriendAction = (action, friendId) => {
    console.log(`${action} friend:`, friendId);
    // Implement actual friend actions here
  };

  const handleRequestAction = (action, requestId) => {
    console.log(`${action} request:`, requestId);
    // Implement actual request actions here
  };

  const onlineFriends = friends.filter(f => f.status === 'online' || f.status === 'away' || f.status === 'busy');
  const offlineFriends = friends.filter(f => f.status === 'offline');

  return (
    <div className="rounded-2xl">
      {/* Modern Header with Gradient */}
      <div className="relative bg-gradient-to-r from-purple-60/20 to-purple-70/20 border-b border-gray-20 p-6">
        <div className="absolute inset-0 bg-gray-10/80 backdrop-blur-sm" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-60/20 rounded-xl">
              <Users size={24} className="text-purple-60" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white-99">Friends</h2>
              <p className="text-sm text-gray-50">Connect and compete with friends</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-60 hover:bg-purple-65 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <UserPlus size={16} />
            Add Friend
          </button>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex gap-2">
          <TabButton
            active={activeTab === 'friends'}
            onClick={() => setActiveTab('friends')}
            count={friends.length}
          >
            <UserCheck size={16} />
            Friends
          </TabButton>
          <TabButton
            active={activeTab === 'requests'}
            onClick={() => setActiveTab('requests')}
            count={friendRequests.length}
          >
            <Clock size={16} />
            Requests
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-6">
        {activeTab === 'friends' && (
          <div className="space-y-6">
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-15 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users size={32} className="text-gray-40" />
                </div>
                <h3 className="text-lg font-semibold text-white-99 mb-2">No friends yet</h3>
                <p className="text-gray-50 mb-6 max-w-sm mx-auto">Start your coding journey by connecting with other developers</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-purple-60 hover:bg-purple-65 text-white rounded-xl transition-all duration-200 font-medium"
                >
                  Find Your First Friend
                </button>
              </div>
            ) : (
              <>
                {/* Online Friends */}
                {onlineFriends.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <h3 className="text-sm font-semibold text-white-95 uppercase tracking-wide">
                        Online ({onlineFriends.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {onlineFriends.map(friend => (
                        <FriendBar
                          key={friend.id}
                          friend={friend}
                          context="friend"
                          onClick={() => console.log('Clicked friend:', friend.name)}
                          onViewProfile={() => handleFriendAction('view', friend.id)}
                          onChat={() => handleFriendAction('chat', friend.id)}
                          onRemoveFriend={() => handleFriendAction('remove', friend.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Offline Friends */}
                {offlineFriends.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-40 rounded-full" />
                      <h3 className="text-sm font-semibold text-white-95 uppercase tracking-wide">
                        Offline ({offlineFriends.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {offlineFriends.map(friend => (
                        <FriendBar
                          key={friend.id}
                          friend={friend}
                          context="friend"
                          onClick={() => console.log('Clicked friend:', friend.name)}
                          onViewProfile={() => handleFriendAction('view', friend.id)}
                          onChat={() => handleFriendAction('chat', friend.id)}
                          onRemoveFriend={() => handleFriendAction('remove', friend.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-3">
            {friendRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-15 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Clock size={32} className="text-gray-40" />
                </div>
                <h3 className="text-lg font-semibold text-white-99 mb-2">No friend requests</h3>
                <p className="text-gray-50">New friend requests will appear here</p>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-white-95 uppercase tracking-wide mb-4">
                  Pending Requests ({friendRequests.length})
                </h3>
                <div className="space-y-2">
                  {friendRequests.map(request => (
                    <FriendBar
                      key={request.id}
                      friend={request}
                      context="request"
                      onClick={() => console.log('Clicked request:', request.name)}
                      onAcceptRequest={() => handleRequestAction('accept', request.id)}
                      onDeclineRequest={() => handleRequestAction('decline', request.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSearchQuery('');
          setSearchResults([]);
        }}
        title="Add Friend"
      >
        <div className="space-y-6">
          <SearchField
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            onSearch={handleSearch}
            placeholder="Search by username or email..."
            recentSearches={recentSearches}
            showRecentSearches={searchQuery === ''}
            onClearRecentSearches={() => setRecentSearches([])}
          />

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white-95 uppercase tracking-wide">Search Results</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {searchResults.map(result => (
                  <FriendBar
                    key={result.id}
                    friend={result}
                    context="search"
                    onClick={() => console.log('Clicked search result:', result.name)}
                    onSendRequest={() => {
                      console.log('Send request to:', result.id);
                      // Implement send request logic
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-15 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search size={24} className="text-gray-40" />
              </div>
              <h3 className="font-semibold text-white-99 mb-2">No users found</h3>
              <p className="text-gray-50">Try searching with a different username or email</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FriendsList;