"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Typography from "../ui/Typography";
import { handleRegister } from "@/api/actions/firebaseAuth";
import useAuth from "@/hooks/useAuth";
import Form from "next/form";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, X } from "lucide-react";
import Button from "../ui/Button";
import { SoundButton } from "../ui/SoundButton";

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [state, handleEmailLogin, isPending] = useActionState(handleRegister, {})
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(()=>{
    if(state?.success){
      setUser(state?.userDetails)
      router.push('/')
    }
  },[state?.userDetails])


  // Password strength calculator
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const passwordsDontMatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-screen w-full bg-circuit-board bg-gray-08 flex items-center justify-center p-3">

      {/* Register Form */}
      <Form 
        action={handleEmailLogin} 
        className="relative flex flex-col gap-3 p-3 md:p-6 bg-gray-10/80 backdrop-blur-xl rounded-2xl border border-gray-20 w-full max-w-md animate-fadeIn"
      >
        {/* Header */}
        <div className="flex flex-col justify-center items-center gap-2 mb-2">
          <div className="w-16 h-16 bg-purple-60/20 rounded-2xl flex items-center justify-center mb-2">
            <UserPlus className="w-8 h-8 text-purple-60" />
          </div>
          <Typography variant="h1" as="h1" className="text-white-99">
            Create Account
          </Typography>
          <Typography variant="body" className="text-gray-50">
            Register to start your coding journey
          </Typography>
        </div>

        {/* Username Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Username</label>
          <Input
            name="username"
            type="text"
            placeholder="Choose a username"
            startIcon={<User size={18} />}
          />
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock size={18} />}
            endIcon={
              <SoundButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </SoundButton>
            }
          />
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i < passwordStrength ? getStrengthColor() : 'bg-gray-20'
                    }`}
                  />
                ))}
              </div>
              <Typography variant="body" className={`text-xs ${
                passwordStrength <= 1 ? 'text-red-400' : 
                passwordStrength <= 3 ? 'text-yellow-400' : 
                'text-green-400'
              }`}>
                Password strength: {getStrengthText()}
              </Typography>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-50 font-medium">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startIcon={<Lock size={18} />}
              endIcon={
                <div className="flex items-center gap-2">
                  <SoundButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </SoundButton>
                </div>
              }
            />
          </div>
          {passwordsDontMatch && (
            <Typography variant="body" className="text-xs text-red-400">
              Passwords do not match
            </Typography>
          )}
        </div>

        {/* Terms and Conditions */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 bg-gray-15 border border-gray-20 rounded cursor-pointer appearance-none checked:bg-purple-60 checked:border-purple-60 transition-all"
            />
            {agreedToTerms && (
              <Check size={14} className="absolute text-white-99 pointer-events-none" />
            )}
          </div>
          <Typography variant="body" className="text-xs text-gray-50 group-hover:text-white-99 transition-colors">
            I agree to the{' '}
            <button type="button" className="text-purple-60 hover:text-purple-65 font-medium">
              Terms of Service
            </button>
            {' '}and{' '}
            <button type="button" className="text-purple-60 hover:text-purple-65 font-medium">
              Privacy Policy
            </button>
          </Typography>
        </label>

        {/* Register Button */}
        <Button type="submit" disabled={isPending || !agreedToTerms} className="flex justify-center gap-2">
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white-99 border-t-transparent rounded-full animate-spin"></div>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Error Message */}
        {state?.success === false && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Typography variant="body" className="text-red-400 text-center text-sm">
              {state.message}
            </Typography>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-2">
          <Typography variant="body" className="text-gray-50">
            Already have an account?{' '}
            <button type="button" className="text-purple-60 hover:text-purple-65 font-medium transition-colors">
              Login
            </button>
          </Typography>
        </div>
      </Form>
    </div>
  );
}

