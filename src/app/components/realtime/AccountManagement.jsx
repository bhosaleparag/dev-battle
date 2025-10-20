
'use client';
import React, { useState } from 'react';
import { Download, UserX, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, reauthenticateWithCredential, EmailAuthProvider, deleteUser as firebaseDeleteUser } from 'firebase/auth';
import { downloadUserData, deactivateAccount, deleteAccount } from '@/api/actions/firebaseAuth';
import { auth } from '@/lib/firebase';

export default function AccountManagement({ userId }) {
  const router = useRouter();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Download User Data
  const handleDownloadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await downloadUserData(userId);
      
      if (result.success) {
        // Create blob and download
        const blob = new Blob([result.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert('Your data has been downloaded successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to download data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Deactivate Account
  const handleDeactivate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await deactivateAccount(userId);
      
      if (result.success) {
        await signOut(auth);
        router.push('/login?deactivated=true');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to deactivate account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeactivateModal(false);
    }
  };

  // Delete Account
  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password to confirm deletion.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        setError('User not authenticated.');
        return;
      }

      // Reauthenticate user before deletion (Firebase security requirement)
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete from Firestore
      const result = await deleteAccount(userId, password);
      
      if (!result.success) {
        setError(result.message);
        return;
      }

      // Delete from Firebase Auth
      await firebaseDeleteUser(user);
      
      // Redirect to goodbye page
      router.push('/goodbye');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-20 pt-6">
      <h4 className="text-white font-medium mb-3">Account Management</h4>
      <div className="space-y-3">
        
        {/* Download Data */}
        <button 
          onClick={handleDownloadData}
          disabled={loading}
          className="w-full text-left px-4 py-3 bg-gray-15 border border-gray-20 rounded-lg text-gray-50 hover:bg-gray-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                <Download size={18} />
                Download My Data
              </div>
              <div className="text-sm text-gray-60">Get a copy of all your data</div>
            </div>
          </div>
        </button>

        {/* Deactivate Account */}
        <button 
          onClick={() => setShowDeactivateModal(true)}
          disabled={loading}
          className="w-full text-left px-4 py-3 bg-gray-15 border border-gray-20 rounded-lg text-gray-50 hover:bg-gray-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                <UserX size={18} />
                Deactivate Account
              </div>
              <div className="text-sm text-gray-60">Temporarily disable your account</div>
            </div>
          </div>
        </button>

        {/* Delete Account */}
        <button 
          onClick={() => setShowDeleteModal(true)}
          disabled={loading}
          className="w-full text-left px-4 py-3 bg-red-900 border border-red-700 rounded-lg text-red-300 hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                <Trash2 size={18} />
                Delete Account
              </div>
              <div className="text-sm text-red-400">Permanently delete your account and all data</div>
            </div>
          </div>
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-10 border border-gray-20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Deactivate Account?</h3>
            </div>
            <p className="text-gray-50 mb-6">
              Your account will be temporarily disabled. You can reactivate it anytime by logging in again. Your data will be preserved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white hover:bg-gray-20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-yellow-600 rounded-lg text-white hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-10 border border-red-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Account?</h3>
            </div>
            <p className="text-gray-50 mb-4">
              This action is <strong className="text-red-400">permanent and cannot be undone</strong>. All your data including:
            </p>
            <ul className="text-gray-50 mb-6 space-y-1 list-disc list-inside">
              <li>Profile information</li>
              <li>Quiz history and scores</li>
              <li>Achievements and badges</li>
              <li>Coding battles history</li>
              <li>Friends and connections</li>
            </ul>
            <p className="text-gray-50 mb-4">
              will be <strong className="text-red-400">permanently deleted</strong>.
            </p>

            {/* Password Input */}
            <div className="mb-6">
              <label className="text-sm text-gray-50 font-medium mb-2 block">
                Enter your password to confirm
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full bg-gray-15 border border-gray-20 rounded-lg px-4 py-3 pr-11 text-white placeholder:text-gray-50 focus:outline-none focus:border-red-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-15 border border-gray-20 rounded-lg text-white hover:bg-gray-20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || !password}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}