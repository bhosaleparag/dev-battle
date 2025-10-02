"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "../ui/Typography";
import Form from 'next/form'
import Input from "../ui/Input";
import { Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { handleGoogleLogin, handleLogin } from "@/api/actions/firebaseAuth";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [state, handleEmailLogin, isPending] = useActionState(handleLogin, {})
  const [showPassword, setShowPassword] = useState(false);

  useEffect(()=>{
    if(state?.success){
      setUser(state?.userDetails)
      router.push('/')
      toast.success('Welcome back!', {
        description: 'You\'re now logged in',
        duration: 4000,
      });
    } else {
      if(state?.message){
        toast.error(state?.message, {
          duration: 4000,
        });
      }
    }
  },[state?.userDetails])

  return (
    <Form action={handleEmailLogin} className="flex flex-col gap-4 p-10 bg-gray-10 rounded-md border border-gray-20 w-1/3">
      <div className="flex flex-col justify-center items-center">
        <Typography variant="h1" as='h1'>Welcome Back</Typography>
        <Typography variant="body">Log in to continue</Typography>
      </div>
      <Input
        name="email"
        type="email"
        placeholder="Enter email"
      />
      <Input
        type={`${showPassword ? "text" : "password"}`}
        name="password"
        placeholder="Password"
        endIcon={
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff/> : <Eye/>}
          </button>
        }
      />
      <Button type="submit">{isPending ? 'submitting...' : 'Login'}</Button>
      <Typography variant="h4" className="text-center">or</Typography>
      <Button variant="text" type="button" onClick={()=>{
        handleGoogleLogin()
        router.push('/')
      }}>
        Login with Google
      </Button>
      {!state?.success && <Typography variant="body" className="text-red-400">{state.message}</Typography>}
    </Form>
  );
}