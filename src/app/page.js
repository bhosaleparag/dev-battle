"use client";
import NonSignUser from './components/dashboard/NonSignUser';
import SignedInDashboard from './components/dashboard/SignUsers';
import useAuth from './hooks/useAuth';

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();  

  // Logged In Dashboard View
  return (
    <>
    {isLoggedIn ? (
      <SignedInDashboard user={user} />
    ):(
      <NonSignUser/>
    )}
    </>
  );
}