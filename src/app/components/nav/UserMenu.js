"use client";
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import UserProfileDropdown from './UserProfileDropdown';
import Button from '../ui/Button';

export default function UserMenu() {
  const { isLoggedIn, signOut, user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <UserProfileDropdown 
          user={user} 
          signOut={signOut} 
          onOpenSettings={() => router.push('/settings')} 
          userStats={user?.stats} 
        />
      ) : (
        <>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/login')}
            className="hidden sm:flex"
          >
            Login
          </Button>
          <Button 
            variant="filled" 
            onClick={() => router.push('/register')}
          >
            <span className="hidden sm:inline">Sign Up</span>
            <span className="sm:hidden">Join</span>
          </Button>
        </>
      )}
    </div>
  );
}
