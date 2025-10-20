'use client';
import { useState } from 'react';
import { useActionState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { handleForgotPassword } from '@/api/actions/firebaseAuth';

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(handleForgotPassword, {
    success: null,
    message: ''
  });
  const [emailSent, setEmailSent] = useState(false);

  // Show success screen after email is sent
  if (state?.success && !emailSent) {
    setEmailSent(true);
  }

  return (
    <div className="min-h-full bg-circuit-board w-full bg-gray-08 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Forgot Password Form */}
      <div className="relative flex flex-col gap-6 p-6 md:p-10 bg-gray-10/80 backdrop-blur-xl rounded-2xl border border-gray-20 w-full max-w-md shadow-2xl animate-fadeIn">
        
        {!emailSent ? (
          <form action={formAction} className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-2 mb-2">
              <div className="w-16 h-16 bg-purple-60/20 rounded-2xl flex items-center justify-center mb-2">
                <Mail className="w-8 h-8 text-purple-60" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white-99">
                Forgot Password?
              </h1>
              <p className="text-sm md:text-base text-gray-50 text-center">
                No worries! Enter your email and we'll send you a reset link
              </p>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-50 font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-50">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-15 border border-gray-20 rounded-lg pl-11 pr-4 py-3 text-white-99 placeholder:text-gray-50 focus:outline-none focus:border-purple-60 transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {!state?.success && state?.message && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-center text-sm">
                  {state.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-purple-60 hover:bg-purple-65 text-white-99 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white-99 border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Reset Link
                </>
              )}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-gray-50 hover:text-white-99 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </form>
        ) : (
          // Success Screen
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white-99">
                Check Your Email
              </h2>
              <p className="text-sm md:text-base text-gray-50 text-center">
                {state.message}
              </p>
            </div>

            <div className="w-full p-4 bg-purple-60/10 border border-purple-60/20 rounded-lg">
              <p className="text-sm text-gray-50 text-center">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full bg-gray-15 hover:bg-gray-20 text-white-99 py-3 px-4 rounded-lg font-medium transition-all"
              >
                Try Another Email
              </button>
              
              <button
                onClick={() => window.location.href = '/login'}
                className="text-purple-60 hover:text-purple-65 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}