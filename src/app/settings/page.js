// components/AccountSettings.js
"use client";
import { useState, useRef, useEffect, useCallback, useMemo, useTransition } from 'react';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { User, Camera, Lock, Bell, Palette, Shield } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Memoized Tab Button Component
const TabButton = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
      isActive
        ? 'bg-purple-60 text-white'
        : 'text-gray-50 hover:bg-gray-15'
    }`}
  >
    <tab.icon size={20} className="mr-3" />
    {tab.label}
  </button>
);

// Memoized Checkbox Component
const Checkbox = ({ checked, onChange, label, description }) => (
  <label className="flex items-start">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="mr-3 w-4 h-4 mt-0.5 text-purple-60 rounded focus:ring-purple-60"
    />
    <div className="flex-1">
      <span className="text-gray-50">{label}</span>
      {description && <p className="text-gray-60 text-sm mt-1">{description}</p>}
    </div>
  </label>
);

// Constants
const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' }
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'GMT' },
  { value: 'Europe/Paris', label: 'Central European Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time' }
];

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public - Anyone can see your profile' },
  { value: 'friends', label: 'Friends only - Only friends can see your profile' },
  { value: 'private', label: 'Private - Only you can see your profile' }
];

export default function AccountSettings() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  
  // Consolidated state objects
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
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });
  
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
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    friendRequests: true,
    gameInvites: true,
    achievements: true,
    weeklyDigest: true,
    marketing: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    allowFriendRequests: true,
    allowGameInvites: true,
    showLastSeen: true,
    dataProcessing: true,
    analytics: true
  });

  // Memoize docRef
  const docRef = useMemo(() => 
    user?.uid ? doc(db, 'users', user.uid) : null, 
    [user?.uid]
  );

  // Redirect if no user
  useEffect(() => {
    if (!user?.uid) {
      router.push('/');
    }
  }, [user?.uid, router]);

  // Show message helper
  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Load user data
  const loadUserData = useCallback(async () => {
    if (!user || !docRef) return;
    
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
        
        if (userData.preferences) {
          setPreferences(prev => ({ ...prev, ...userData.preferences }));
        }
        
        if (userData.notifications) {
          setNotifications(prev => ({ ...prev, ...userData.notifications }));
        }
        
        if (userData.privacy) {
          setPrivacy(prev => ({ ...prev, ...userData.privacy }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showMessage('error', 'Failed to load user data');
    }
  }, [user, docRef, showMessage]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Avatar upload handler
  const handleAvatarUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage('error', 'Image size should be less than 2MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Only JPG, PNG images are allowed');
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user.uid);

        const res = await fetch("/api/profile-pic", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) throw new Error('Upload failed');
        
        const { url } = await res.json();
        await updateProfile(auth.currentUser, { photoURL: url });
        await updateDoc(docRef, { avatar: url });
        
        setProfile(prev => ({ ...prev, avatar: url }));
        showMessage('success', 'Avatar updated successfully!');
      } catch (error) {
        showMessage('error', 'Failed to upload avatar: ' + error.message);
      }
    });
  }, [user?.uid, docRef, showMessage]);

  // Profile update handler
  const handleProfileUpdate = useCallback(async () => {
    startTransition(async () => {
      try {
        await updateProfile(auth.currentUser, {
          displayName: profile.username,
          photoURL: profile.avatar
        });

        await updateDoc(docRef, {
          ...profile,
          updatedAt: new Date()
        });
        
        setUser(user => ({ ...user, profile }));
        showMessage('success', 'Profile updated successfully!');
      } catch (error) {
        showMessage('error', 'Failed to update profile: ' + error.message);
      }
    });
  }, [profile, docRef, setUser, showMessage]);

  // Password change handler
  const handlePasswordChange = useCallback(async () => {
    if (security.newPassword !== security.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (security.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    startTransition(async () => {
      try {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          security.currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, security.newPassword);
        
        setSecurity({ 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '', 
          twoFactorEnabled: false 
        });
        showMessage('success', 'Password updated successfully!');
      } catch (error) {
        showMessage('error', 'Failed to update password: ' + error.message);
      }
    });
  }, [security, showMessage]);

  // Generic update handler for settings
  const handleSettingsUpdate = useCallback((data, field) => {
    startTransition(async () => {
      try {
        await updateDoc(docRef, {
          [field]: data,
          updatedAt: new Date()
        });
        showMessage('success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      } catch (error) {
        showMessage('error', `Failed to update ${field}: ` + error.message);
      }
    });
  }, [docRef, showMessage]);

  // Memoized handlers
  const handlePreferencesUpdate = useCallback(() => 
    handleSettingsUpdate(preferences, 'preferences'), 
    [preferences, handleSettingsUpdate]
  );
  
  const handleNotificationsUpdate = useCallback(() => 
    handleSettingsUpdate(notifications, 'notifications'), 
    [notifications, handleSettingsUpdate]
  );
  
  const handlePrivacyUpdate = useCallback(() => 
    handleSettingsUpdate(privacy, 'privacy'), 
    [privacy, handleSettingsUpdate]
  );

  // Profile Tab Content
  const ProfileTab = useMemo(() => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
      
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Image
            width={90}
            height={90}
            src={profile.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="rounded-full object-cover border-2 border-gray-20"
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
            disabled
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
            placeholder="Your city, country"
          />
        </div>
        <div>
          <label className="block text-gray-50 text-sm font-medium mb-2">Website</label>
          <Input
            type="url"
            value={profile.website}
            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
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
          />
        </div>
        <div>
          <label className="block text-gray-50 text-sm font-medium mb-2">Gender</label>
          <Select
            value={profile.gender}
            onChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
            options={GENDER_OPTIONS}
          />
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Profile Visibility</h4>
        <div className="space-y-2">
          <Checkbox
            checked={profile.isProfilePublic}
            onChange={(e) => setProfile(prev => ({ ...prev, isProfilePublic: e.target.checked }))}
            label="Make profile public"
          />
          <Checkbox
            checked={profile.showEmail}
            onChange={(e) => setProfile(prev => ({ ...prev, showEmail: e.target.checked }))}
            label="Show email on profile"
          />
          <Checkbox
            checked={profile.showStats}
            onChange={(e) => setProfile(prev => ({ ...prev, showStats: e.target.checked }))}
            label="Show game statistics"
          />
        </div>
      </div>

      <button
        onClick={handleProfileUpdate}
        disabled={isPending}
        className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  ), [profile, isPending, handleAvatarUpload, handleProfileUpdate]);

  // Security Tab Content
  const SecurityTab = useMemo(() => (
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
        <Checkbox
          checked={security.twoFactorEnabled}
          onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
          label="Enable two-factor authentication"
          description="Add an extra layer of security to your account"
        />
      </div>

      <button
        onClick={handlePasswordChange}
        disabled={isPending || !security.currentPassword || !security.newPassword}
        className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  ), [security, isPending, handlePasswordChange]);

  // Preferences Tab Content
  const PreferencesTab = useMemo(() => (
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
            {LANGUAGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-50 text-sm font-medium mb-2">Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white focus:outline-none focus:border-purple-60"
          >
            {TIMEZONE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sound & Audio */}
      <div>
        <h4 className="text-white font-medium mb-3">Audio Settings</h4>
        <div className="space-y-2">
          <Checkbox
            checked={preferences.soundEffects}
            onChange={(e) => setPreferences(prev => ({ ...prev, soundEffects: e.target.checked }))}
            label="Sound effects"
          />
          <Checkbox
            checked={preferences.backgroundMusic}
            onChange={(e) => setPreferences(prev => ({ ...prev, backgroundMusic: e.target.checked }))}
            label="Background music"
          />
          <Checkbox
            checked={preferences.vibration}
            onChange={(e) => setPreferences(prev => ({ ...prev, vibration: e.target.checked }))}
            label="Vibration (mobile)"
          />
        </div>
      </div>

      {/* Gameplay */}
      <div>
        <h4 className="text-white font-medium mb-3">Gameplay</h4>
        <div className="space-y-2">
          <Checkbox
            checked={preferences.autoJoinMatches}
            onChange={(e) => setPreferences(prev => ({ ...prev, autoJoinMatches: e.target.checked }))}
            label="Auto-join matches when available"
          />
          <Checkbox
            checked={preferences.showOnlineStatus}
            onChange={(e) => setPreferences(prev => ({ ...prev, showOnlineStatus: e.target.checked }))}
            label="Show online status to friends"
          />
        </div>
      </div>

      <button
        onClick={handlePreferencesUpdate}
        disabled={isPending}
        className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Updating...' : 'Save Preferences'}
      </button>
    </div>
  ), [preferences, isPending, handlePreferencesUpdate]);

  // Notifications Tab Content
  const NotificationsTab = useMemo(() => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Notification Settings</h3>
      
      <div>
        <h4 className="text-white font-medium mb-3">General</h4>
        <div className="space-y-2">
          <Checkbox
            checked={notifications.emailNotifications}
            onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
            label="Email notifications"
          />
          <Checkbox
            checked={notifications.pushNotifications}
            onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
            label="Push notifications"
          />
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-3">Social</h4>
        <div className="space-y-2">
          <Checkbox
            checked={notifications.friendRequests}
            onChange={(e) => setNotifications(prev => ({ ...prev, friendRequests: e.target.checked }))}
            label="Friend requests"
          />
          <Checkbox
            checked={notifications.gameInvites}
            onChange={(e) => setNotifications(prev => ({ ...prev, gameInvites: e.target.checked }))}
            label="Game invites"
          />
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-3">Game Updates</h4>
        <div className="space-y-2">
          <Checkbox
            checked={notifications.achievements}
            onChange={(e) => setNotifications(prev => ({ ...prev, achievements: e.target.checked }))}
            label="Achievement unlocks"
          />
          <Checkbox
            checked={notifications.weeklyDigest}
            onChange={(e) => setNotifications(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
            label="Weekly performance digest"
          />
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-3">Marketing</h4>
        <Checkbox
          checked={notifications.marketing}
          onChange={(e) => setNotifications(prev => ({ ...prev, marketing: e.target.checked }))}
          label="Promotional emails and updates"
          description="Receive news about new features and special events"
        />
      </div>

      <button
        onClick={handleNotificationsUpdate}
        disabled={isPending}
        className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Updating...' : 'Save Notification Settings'}
      </button>
    </div>
  ), [notifications, isPending, handleNotificationsUpdate]);

  // Privacy Tab Content
  const PrivacyTab = useMemo(() => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Privacy & Data</h3>
      
      <div>
        <h4 className="text-white font-medium mb-3">Profile Visibility</h4>
        <div className="space-y-2">
          {PRIVACY_OPTIONS.map((option) => (
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

      <div>
        <h4 className="text-white font-medium mb-3">Social Interactions</h4>
        <div className="space-y-2">
          <Checkbox
            checked={privacy.allowFriendRequests}
            onChange={(e) => setPrivacy(prev => ({ ...prev, allowFriendRequests: e.target.checked }))}
            label="Allow friend requests from other users"
          />
          <Checkbox
            checked={privacy.allowGameInvites}
            onChange={(e) => setPrivacy(prev => ({ ...prev, allowGameInvites: e.target.checked }))}
            label="Allow game invites from friends"
          />
          <Checkbox
            checked={privacy.showLastSeen}
            onChange={(e) => setPrivacy(prev => ({ ...prev, showLastSeen: e.target.checked }))}
            label='Show "last seen" status to friends'
          />
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-3">Data Collection</h4>
        <div className="space-y-2">
          <Checkbox
            checked={privacy.dataProcessing}
            onChange={(e) => setPrivacy(prev => ({ ...prev, dataProcessing: e.target.checked }))}
            label="Allow data processing for personalized experience"
          />
          <Checkbox
            checked={privacy.analytics}
            onChange={(e) => setPrivacy(prev => ({ ...prev, analytics: e.target.checked }))}
            label="Share anonymous usage analytics"
          />
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
        disabled={isPending}
        className="bg-purple-60 text-white px-6 py-2 rounded-lg hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Updating...' : 'Save Privacy Settings'}
      </button>
    </div>
  ), [privacy, isPending, handlePrivacyUpdate]);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return ProfileTab;
      case 'security': return SecurityTab;
      case 'preferences': return PreferencesTab;
      case 'notifications': return NotificationsTab;
      case 'privacy': return PrivacyTab;
      default: return null;
    }
  };

  if (!user?.uid) return null;

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
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <TabButton
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
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