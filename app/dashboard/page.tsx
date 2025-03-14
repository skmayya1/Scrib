"use client";
import Section from "@/Components/Dashboard/Section";
import Navbar from "@/Components/Navbar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { History, ExternalLink } from 'lucide-react';

type ExtensionStatus = 'not_installed' | 'idle' | 'recording';

const Page = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [extensionStatus, setExtensionStatus] = React.useState<ExtensionStatus>('idle');
  const [trialCount, setTrialCount] = React.useState(0);

  if (!isPending && !session) {
    router.push("/");
  }

  const setTrialCountMethod = async (count: number) =>{
    setTrialCount(count);
  }

  return (
    <div className="bg-[#191818] min-h-screen w-full">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex-col py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back{session?.user?.name ? `, ${session.user.name}` : null}</h1>
              <p className="text-zinc-400 text-sm md:text-base">Here&apos;s what&apos;s happening with your meetings</p>
              <div className="mt-2 text-sm text-emerald-500">
                <span className="font-medium">{5 - trialCount} meets left</span> in your free trial • <span className="underline cursor-pointer">Upgrade now</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
                <p className="font-medium text-zinc-300">Quick Start Guide:</p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs">1</span>
                  <span>Install the Chrome extension to enable meeting recording</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs">2</span>
                  <span>Join your Google Meet or Zoom meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs">3</span>
                  <span>Click the extension icon to start recording</span>
                </div>
              </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <History size={16} />
            <span className="text-sm font-medium tracking-wide">Recent Meetings</span>
          </div>
        </div>
        <Section setTrialCountMethod={setTrialCountMethod} />
      </div>
    </div>
  );
};

export default Page;

{
  /* 
              <button onClick={() => {
                authClient.signOut()
          }}>Sign Out</button>
    */
}
