"use client";
import Button from '@/components/ui/Button'
import useAuth from '@/hooks/useAuth'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

function EditBtn({uid}) {
  const { user } = useAuth();
  const router = useRouter();

  if(user?.uid !== uid) return null;

  return (
    <Button className="hidden md:flex" onClick={()=>router.push('/settings')}>
      <User className="w-5 h-5" />
      Edit Profile
    </Button>
  )
}

export default EditBtn