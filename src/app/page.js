"use client";
import useAuth from "@/hooks/useAuth";
import SignUsers from "./components/dashboard/SignUsers";
import NonSignUser from "./components/dashboard/NonSignUser";

function Dashboard() {
  const { isLoggedIn } = useAuth();
  if(isLoggedIn){
    return <SignUsers/>
  }
  return (
    <NonSignUser/>
  )
}

export default Dashboard