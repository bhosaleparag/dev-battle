// components/AccountSettings.js
"use client"
import { useState, useRef, useEffect } from 'react';
import { 
  updateProfile, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { User, Camera, Lock, Bell, Palette, Shield, Award, Activity } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AccountSettings() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  // Profile state
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    location: '',
    website: '',
    birthDate: '',
    gender: '',
    isProfilePublic: true,
    showEmail: false,
    showStats: true
  });
  
  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    soundEffects: true,
    backgroundMusic: true,
    vibration: true,
    autoJoinMatches: false,
    showOnlineStatus: true
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    friendRequests: true,
    gameInvites: true,
    achievements: true,
    weeklyDigest: true,
    marketing: false
  });
  
  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // public, friends, private
    allowFriendRequests: true,
    allowGameInvites: true,
    showLastSeen: true,
    dataProcessing: true,
    analytics: true
  });

  if(!user?.uid) return router.push('/')
  const docRef = doc(db, 'users', user.uid);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile(prev => ({
          ...prev,
          username: userData.username || user.displayName || '',
          email: userData.email || user.email || '',
          bio: userData.bio || '',
          avatar: userData.avatar || user.photoURL || '',
          location: userData.location || '',
          website: userData.website || '',
          birthDate: userData.birthDate || '',
          gender: userData.gender || '',
          isProfilePublic: userData.isProfilePublic ?? true,
          showEmail: userData.showEmail ?? false,
          showStats: userData.showStats ?? true
        }));
        
        setPreferences(prev => ({
          ...prev,
          ...userData.preferences
        }));
        
        setNotifications(prev => ({
          ...prev,
          ...userData.notifications
        }));
        
        setPrivacy(prev => ({
          ...prev,
          ...userData.privacy
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      showMessage('error', 'Image size should be less than 2MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Only JPG, PNG images are allowed');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.uid);

      const res = await fetch("/api/profile-pic", {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json()

      await updateProfile(auth.currentUser, { photoURL: url });
      await updateDoc(docRef, { avatar: url });
      
      setProfile(prev => ({ ...prev, avatar: url }));
      showMessage('success', 'Avatar updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to upload avatar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profile.username,
        photoURL: profile.avatar
      });

      // Update Firestore document
      await updateDoc(docRef, {
        username: profile.username,
        email: profile.email,
        bio: profile.bio,
        avatar: profile.avatar,
        location: profile.location,
        website: profile.website,
        birthDate: profile.birthDate,
        gender: profile.gender,
        isProfilePublic: profile.isProfilePublic,
        showEmail: profile.showEmail,
        showStats: profile.showStats,
        updatedAt: new Date()
      });
      setUser(user=>({...user, profile}))
      
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (security.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        security.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, security.newPassword);
      
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorEnabled: false });
      showMessage('success', 'Password updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(docRef, {
        preferences: preferences,
        updatedAt: new Date()
      });
      showMessage('success', 'Preferences updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update preferences: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(docRef, {
        notifications: notifications,
        updatedAt: new Date()
      });
      showMessage('success', 'Notification preferences updated!');
    } catch (error) {
      showMessage('error', 'Failed to update notifications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(docRef, {
        privacy: privacy,
        updatedAt: new Date()
      });
      showMessage('success', 'Privacy settings updated!');
    } catch (error) {
      showMessage('error', 'Failed to update privacy settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
            
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={profile.avatar || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-20"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-purple-60 text-white p-2 rounded-full hover:bg-purple-65 transition-colors"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h4 className="text-white font-medium">Profile Picture</h4>
                <p className="text-gray-60 text-sm">JPG, PNG. Max size 2MB.</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Username</label>
                <Input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-50 text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-15 bg-transparent rounded-lg text-white focus:outline-none focus:border-purple-60 resize-none"
                rows="3"
                placeholder="Tell us about yourself..."
                maxLength="200"
              />
              <p className="text-gray-60 text-xs mt-1">{profile.bio.length}/200 characters</p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Location</label>
                <Input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                  placeholder="Your city, country"
                />
              </div>
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Website</label>
                <Input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Birth Date</label>
                <Input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                />
              </div>
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Gender</label>
                <Select
                  value={profile.gender}
                  onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                  options={[{value: '', label: 'Select gender'}, {value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}, {value: 'prefer-not-to-say', label: 'Prefer not to say'}]}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                />
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Profile Visibility</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.isProfilePublic}
                    onChange={(e) => setProfile(prev => ({ ...prev, isProfilePublic: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Make profile public</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.showEmail}
                    onChange={(e) => setProfile(prev => ({ ...prev, showEmail: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Show email on profile</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.showStats}
                    onChange={(e) => setProfile(prev => ({ ...prev, showStats: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Show game statistics</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="border-t border-gray-20 pt-4">
              <h4 className="text-white font-medium mb-3">Two-Factor Authentication</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={security.twoFactorEnabled}
                  onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                  className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                />
                <span className="text-gray-50">Enable two-factor authentication</span>
              </label>
              <p className="text-gray-60 text-sm mt-1">Add an extra layer of security to your account</p>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={loading || !security.currentPassword || !security.newPassword}
              className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">App Preferences</h3>
            
            {/* Theme */}
            <div>
              <h4 className="text-white font-medium mb-3">Appearance</h4>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'auto'].map((theme) => (
                  <label key={theme} className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={preferences.theme === theme}
                      onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                      className="mr-2 text-purple-60"
                    />
                    <span className="text-gray-50 capitalize">{theme}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language & Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-50 text-sm font-medium mb-2">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">GMT</option>
                  <option value="Europe/Paris">Central European Time</option>
                  <option value="Asia/Tokyo">Japan Standard Time</option>
                </select>
              </div>
            </div>

            {/* Sound & Audio */}
            <div>
              <h4 className="text-white font-medium mb-3">Audio Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.soundEffects}
                    onChange={(e) => setPreferences(prev => ({ ...prev, soundEffects: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Sound effects</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.backgroundMusic}
                    onChange={(e) => setPreferences(prev => ({ ...prev, backgroundMusic: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Background music</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.vibration}
                    onChange={(e) => setPreferences(prev => ({ ...prev, vibration: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Vibration (mobile)</span>
                </label>
              </div>
            </div>

            {/* Gameplay */}
            <div>
              <h4 className="text-white font-medium mb-3">Gameplay</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.autoJoinMatches}
                    onChange={(e) => setPreferences(prev => ({ ...prev, autoJoinMatches: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Auto-join matches when available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.showOnlineStatus}
                    onChange={(e) => setPreferences(prev => ({ ...prev, showOnlineStatus: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Show online status to friends</span>
                </label>
              </div>
            </div>

            <button
              onClick={handlePreferencesUpdate}
              disabled={loading}
              className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Save Preferences'}
            </button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Notification Settings</h3>
            
            {/* General Notifications */}
            <div>
              <h4 className="text-white font-medium mb-3">General</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Push notifications</span>
                </label>
              </div>
            </div>

            {/* Social Notifications */}
            <div>
              <h4 className="text-white font-medium mb-3">Social</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.friendRequests}
                    onChange={(e) => setNotifications(prev => ({ ...prev, friendRequests: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Friend requests</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.gameInvites}
                    onChange={(e) => setNotifications(prev => ({ ...prev, gameInvites: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Game invites</span>
                </label>
              </div>
            </div>

            {/* Game Notifications */}
            <div>
              <h4 className="text-white font-medium mb-3">Game Updates</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.achievements}
                    onChange={(e) => setNotifications(prev => ({ ...prev, achievements: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Achievement unlocks</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) => setNotifications(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Weekly performance digest</span>
                </label>
              </div>
            </div>

            {/* Marketing */}
            <div>
              <h4 className="text-white font-medium mb-3">Marketing</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                />
                <span className="text-gray-50">Promotional emails and updates</span>
              </label>
              <p className="text-gray-60 text-sm mt-1">Receive news about new features and special events</p>
            </div>

            <button
              onClick={handleNotificationsUpdate}
              disabled={loading}
              className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Save Notification Settings'}
            </button>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Privacy & Data</h3>
            
            {/* Profile Privacy */}
            <div>
              <h4 className="text-white font-medium mb-3">Profile Visibility</h4>
              <div className="space-y-2">
                {[
                  { value: 'public', label: 'Public - Anyone can see your profile' },
                  { value: 'friends', label: 'Friends only - Only friends can see your profile' },
                  { value: 'private', label: 'Private - Only you can see your profile' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={option.value}
                      checked={privacy.profileVisibility === option.value}
                      onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                      className="mr-3 text-purple-60"
                    />
                    <span className="text-gray-50">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social Privacy */}
            <div>
              <h4 className="text-white font-medium mb-3">Social Interactions</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacy.allowFriendRequests}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, allowFriendRequests: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Allow friend requests from other users</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacy.allowGameInvites}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, allowGameInvites: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Allow game invites from friends</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacy.showLastSeen}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, showLastSeen: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Show "last seen" status to friends</span>
                </label>
              </div>
            </div>

            {/* Data & Analytics */}
            <div>
              <h4 className="text-white font-medium mb-3">Data Collection</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacy.dataProcessing}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, dataProcessing: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Allow data processing for personalized experience</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={privacy.analytics}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="mr-3 w-4 h-4 text-purple-60 rounded focus:ring-purple-60"
                  />
                  <span className="text-gray-50">Share anonymous usage analytics</span>
                </label>
              </div>
              <p className="text-gray-60 text-sm mt-2">
                This helps us improve the app and provide better recommendations
              </p>
            </div>

            {/* Account Actions */}
            <div className="border-t border-gray-20 pt-6">
              <h4 className="text-white font-medium mb-3">Account Management</h4>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-15 border border-gray-20 rounded-lg text-gray-50 hover:bg-gray-10 transition-colors">
                  <div className="font-medium">Download My Data</div>
                  <div className="text-sm text-gray-60">Get a copy of all your data</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-15 border border-gray-20 rounded-lg text-gray-50 hover:bg-gray-10 transition-colors">
                  <div className="font-medium">Deactivate Account</div>
                  <div className="text-sm text-gray-60">Temporarily disable your account</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-red-900 border border-red-700 rounded-lg text-red-300 hover:bg-red-800 transition-colors">
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-red-400">Permanently delete your account and all data</div>
                </button>
              </div>
            </div>

            <button
              onClick={handlePrivacyUpdate}
              disabled={loading}
              className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Save Privacy Settings'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user, loadUserData]);

  return (
    <div className="flex h-[90vh] overflow-hidden">
      <div className="bg-gray-08 shadow-2xl w-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-10 border-r border-gray-20 flex flex-col">
          <div className="p-6 border-b border-gray-20">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            <p className="text-gray-60 text-sm mt-1">Manage your profile and preferences</p>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-60 text-white'
                        : 'text-gray-50 hover:bg-gray-15'
                    }`}
                  >
                    <tab.icon size={20} className="mr-3" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Message Bar */}
          {message.text && (
            <div className={`px-6 py-3 border-b border-gray-20 ${
              message.type === 'success' ? 'bg-green-900 text-green-300 border-green-700' : 
              message.type === 'error' ? 'bg-red-900 text-red-300 border-red-700' : 
              'bg-blue-900 text-blue-300 border-blue-700'
            }`}>
              <div className="flex items-center">
                <div className="flex-1">{message.text}</div>
                <button 
                  onClick={() => setMessage({ type: '', text: '' })}
                  className="ml-4 text-current hover:opacity-75"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
