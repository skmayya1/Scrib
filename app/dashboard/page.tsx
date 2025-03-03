"use client"
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation';
import React from 'react'

const Page = () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    if (!isPending && !session) {
        router.push('/auth/login')
    }
    console.log(session);

  return (
      <div className='bg-zinc-900 h-screen w-full'>
          <button onClick={() => {
                authClient.signOut()
          }}>Sign Out</button>
      </div>
  )
}

export default Page;