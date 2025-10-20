"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "../ui/Typography";
import Form from 'next/form'
import Input from "../ui/Input";
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react";
import Button from "../ui/Button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { handleGoogleLogin, handleLogin } from "@/api/actions/firebaseAuth";
import { SoundButton } from "../ui/SoundButton";

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
    <div className="min-h-full bg-circuit-board w-full bg-gray-08 flex items-center justify-center p-3">
      {/* Login Form */}
      <Form 
        action={handleEmailLogin} 
        className="relative flex flex-col gap-3 p-3 md:p-6 bg-gray-10/80 backdrop-blur-xl rounded-2xl border border-gray-20 w-full max-w-md animate-fadeIn"
      >
        {/* Header */}
        <div className="flex flex-col justify-center items-center gap-2 mb-2">
          <div className="w-16 h-16 bg-purple-60/20 rounded-2xl flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-purple-60" />
          </div>
          <Typography variant="h1" as="h1" className="text-white-99">
            Welcome Back
          </Typography>
          <Typography variant="body" className="text-gray-50">
            Log in to continue your coding journey
          </Typography>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Email</label>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            startIcon={<Mail size={18} />}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            startIcon={<Lock size={18} />}
            endIcon={
              <SoundButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </SoundButton>
            }
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end -mt-2">
          <button type="button" onClick={()=>router.push('/forgot-password')} className="text-sm text-purple-60 hover:text-purple-65 transition-colors">
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-20"></div>
          <Typography variant="h4" className="text-gray-50">
            or
          </Typography>
          <div className="flex-1 h-px bg-gray-20"></div>
        </div>

        {/* Google Login */}
        <Button 
          variant="text" 
          type="button" 
          className="flex justify-center gap-5"
          onClick={() => {
            handleGoogleLogin();
            // router.push('/');
          }}
        >
          <Chrome size={20} />
          Continue with Google
        </Button>

        {/* Error Message */}
        {state?.success === false && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Typography variant="body" className="text-red-400 text-center">
              {state.message}
            </Typography>
          </div>
        )}

        {/* Sign Up Link */}
        <div className="text-center mt-2">
          <Typography variant="body" className="text-gray-50">
            Don't have an account?{' '}
            <button type="button" onClick={()=>router.push('/register')} className="text-purple-60 hover:text-purple-65 font-medium transition-colors">
              Sign up
            </button>
          </Typography>
        </div>
      </Form>
    </div>
  );
}
