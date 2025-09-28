"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Typography from "../ui/Typography";
import { handleRegister } from "@/api/actions/firebaseAuth";
import useAuth from "@/hooks/useAuth";
import Form from "next/form";
import { Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [state, handleEmailLogin, isPending] = useActionState(handleRegister, {})
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(()=>{
    if(state?.success){
      setUser(state?.userDetails)
      router.push('/')
    }
  },[state?.userDetails])

  return (
    <Form action={handleEmailLogin} className="flex flex-col gap-4 p-10 bg-gray-10 border border-gray-20 w-1/3">
      <div className="flex flex-col justify-center items-center">
        <Typography variant="h1" as='h1'>Welcome Back</Typography>
        <Typography variant="body">Register in to continue</Typography>
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
      <Input
        type={`${showConfirmPassword ? "text" : "password"}`}
        name="confirmPassword"
        placeholder="Confirm Password"
        endIcon={
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff/> : <Eye/>}
          </button>
        }
      />
      <Button type="submit">{isPending ? 'submitting...' : 'Register'}</Button>
      {!state?.success && <Typography variant="body" className="text-red-400">{state.message}</Typography>}
    </Form>
  );
}
