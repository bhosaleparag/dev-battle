"use client";
import React, { Fragment, useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search,
  Clock,
  UserCheck,
  RefreshCcw,
} from 'lucide-react';
import Modal from '@/components/ui/Dialog';
import SearchField from '@/explore/components/SearchField';
import FriendBar from '@/components/ui/FriendBar';
import useAuth from '@/hooks/useAuth';
import { useSocketContext } from '@/context/SocketProvider';
import { getFirestoreUsersByIds, searchUsers } from '@/api/firebase/users';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { SoundButton } from '@/components/ui/SoundButton';

// Tab Button Component
const TabButton = ({ active, onClick, children, count }) => (
  <SoundButton
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
  </SoundButton>
);

const FriendsList = () => {
  const { isConnected, friendsState } = useSocketContext();
  const { getFriends, friendList, removeFriend, acceptFriendRequest, sendFriendRequest } = friendsState;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const handleSearch = async () => {
    let tempSearch = searchQuery.trim();
    if (!tempSearch && tempSearch.length > 4 ) return;
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    let tempFrd = friends?.map(f => f.uid);
    let tempFrdReq = friendRequests?.map(fr => fr.uid);
    const friendsList = [...tempFrdReq, ...tempFrd, user.uid];
    const result = await searchUsers(tempSearch, friendsList);
    setSearchResults(result)
  };

  const onRemoveFriend = async (friendUid) => {
    const removedFriend = friends.find(friend => friend.uid === friendUid);

    setFriends(prev => prev.filter(friend => friend.uid !== friendUid));
    
    try {
      await removeFriend(friendUid);
    } catch (error) {
      // Rollback on error
      if (removedFriend) {
        setFriends(prev => [...prev, removedFriend]);
      }
      // Show error message to user
      toast.error('Failed to remove friend. Please try again.', {
        duration: 4000,
      });
    }
    
  };

  const onAcceptRequest = async (requestUid) => {
    const acceptedFriend = friendRequests.find(req => req.uid === requestUid);
    
    if (!acceptedFriend) return;
    
    // Optimistic update
    setFriendRequests(prev => prev.filter(req => req.uid !== requestUid));
    setFriends(prev => [...prev, acceptedFriend]);
    
    try {
      await acceptFriendRequest(requestUid);
    } catch (error) {
      setFriends(prev => prev.filter(friend => friend.uid !== requestUid));
      setFriendRequests(prev => [...prev, acceptedFriend]);
      
      toast.error('Failed to accept request. Please try again.', {
        duration: 4000,
      });
    }
  };

  const onDeclineRequest = async (requestUid) => {
    const declinedRequest = friendRequests.find(req => req.uid === requestUid);
    setFriendRequests(prev => prev.filter(req => req.uid !== requestUid));
    
    try {
      await removeFriend(requestUid);
    } catch (error) {
      // Rollback on error
      if (declinedRequest) { setFriendRequests(prev => [...prev, declinedRequest]) }
      toast.error('Failed to decline request. Please try again.', {
        duration: 4000,
      });
    }
  };

  const onSendRequest = async (friendUid, friendData = null) => {
    try {
      setShowAddModal(false)
      await sendFriendRequest(friendUid);

      if (friendData) {
        const newRequest = {
          ...friendData,
          presence: 'offline',
          senderId: user.uid
        };
        setFriendRequests(prev => [...prev, newRequest]);
      } else {
        const userData = await getFirestoreUsersByIds([friendUid]);
        if (userData.length > 0) {
          const newRequest = {
            ...userData[0],
            presence: 'offline',
            senderId: user.uid
          };
          setFriendRequests(prev => [...prev, newRequest]);
        }
      }
      toast.success('Friend request sent!', { duration: 3000});
      
    } catch (error) {
      toast.error('Failed to send friend request. Please try again.', { duration: 3000});
    }
  };

  useEffect(() => {
    if(isConnected){ 
      getFriends();
    }
  }, [isConnected, getFriends])
  
  useEffect(() => {
    const handleFriendListUpdate = async () => {
      if(friendList?.accepted?.length > 0){
        const friendPresence = new Map();
        friendList.accepted.forEach(friend => {
          friendPresence.set(friend.uid, { presence: friend.presence, senderId: friend.senderId })
        });
        const tempUIDs = friendList.accepted.map(req=>req.uid)
        const friendsData = await getFirestoreUsersByIds(tempUIDs)
        const mergedFriends = friendsData.map(user => ({
            ...user,
            ...friendPresence.get(user.uid)
        }));
        setFriends(mergedFriends || [])
      } else {
        setFriends([])
      }

      // Handle pending friends - always update, even if empty
      if(friendList?.pending?.length > 0){
        const friendPresence = new Map();
        friendList.pending.forEach(friend => {
          friendPresence.set(friend.uid, { presence: friend.presence, senderId: friend.senderId })
        });
        const tempUIDs = friendList.pending.map(req=>req.uid)
        const requestedFriendData = await getFirestoreUsersByIds(tempUIDs)
        const mergedFriendsReq = requestedFriendData.map(user => ({
            ...user,
            ...friendPresence.get(user.uid)
        }));
        setFriendRequests(mergedFriendsReq || [])
      } else {
        setFriendRequests([])
      }
    }
    handleFriendListUpdate();
  }, [friendList])
  
  const onlineFriends = friends.filter(f => f.presence === 'online' || f.presence === 'away' || f.presence === 'busy');
  const offlineFriends = friends.filter(f => f.presence === 'offline');

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
          <SoundButton
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-60 hover:bg-purple-65 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <UserPlus size={16} />
            Add Friend
          </SoundButton>
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
            count={friendRequests?.length}
          >
            <Clock size={16} />
            Requests
          </TabButton>
          <Button onClick={getFriends} variant="ghost" className="ml-auto spin-once">
            <RefreshCcw size={16}/>
          </Button>
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
                <SoundButton
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-purple-60 hover:bg-purple-65 text-white rounded-xl transition-all duration-200 font-medium"
                >
                  Find Your First Friend
                </SoundButton>
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
                      {onlineFriends.map((friend, idx) => (
                        <Fragment key={idx}>
                          <FriendBar
                            friend={friend}
                            onClick={() => console.log('Clicked friend:', friend.name)}
                            onRemoveFriend={() => onRemoveFriend(friend.uid)}
                          />
                        </Fragment>
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
                      {offlineFriends.map((friend, idx) => (
                        <Fragment key={idx}>
                          <FriendBar
                            friend={friend}
                            context="friend"
                            onClick={() => console.log('Clicked friend:', friend.name)}
                            onRemoveFriend={() => onRemoveFriend(friend.uid)}
                          />
                        </Fragment>
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
            {friendRequests?.length === 0 ? (
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
                  Pending Requests ({friendRequests?.length})
                </h3>
                <div className="space-y-2">
                  {friendRequests?.map((request, idx) => (
                    <Fragment key={idx}>  
                      <FriendBar
                        friend={request}
                        context={`${request?.senderId === user.uid ? 'pending' : 'request'}`}
                        onClick={() => console.log('Clicked request:', request.name)}
                        onAcceptRequest={() => onAcceptRequest(request.uid)}
                        onDeclineRequest={() => onDeclineRequest(request.uid)}
                      />
                    </Fragment>
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
                {}
                {searchResults.map((result, idx) => (
                  <Fragment key={idx}>
                    <FriendBar
                      friend={result}
                      context="search"
                      onClick={() => console.log('Clicked search result:', result.uid, result.username)}
                      onSendRequest={(user)=>onSendRequest(result.uid, user)}
                    />
                  </Fragment>
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