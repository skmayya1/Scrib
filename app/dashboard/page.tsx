"use client";
import Section from "@/Components/Dashboard/Section";
import Navbar from "@/Components/Navbar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { History, ExternalLink } from 'lucide-react';

type ExtensionStatus = 'not_installed' | 'idle' | 'recording';

const Page = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [extensionStatus, setExtensionStatus] = React.useState<ExtensionStatus>('idle');

  if (!isPending && !session) {
    router.push("/auth/login");
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
            </div>
            <div className="w-full md:w-auto flex items-center gap-3">
              <div className="group relative flex items-center gap-3 px-4 py-2 bg-[#242425] rounded-lg text-zinc-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${extensionStatus === 'recording' ? 'bg-red-500 animate-pulse' : extensionStatus === 'idle' ? 'bg-green-500' : 'bg-zinc-500'}`}></div>
                  <span>
                    {extensionStatus === 'recording' ? 'Recording in Progress' :
                     extensionStatus === 'idle' ? 'Extension Ready' :
                     'Browser Extension Required'}
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-zinc-700"></div>
                {extensionStatus === 'not_installed' ? (
                  <button 
                    onClick={() => setExtensionStatus('idle')}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-all duration-200 font-medium hover:gap-2"
                  >
                    Install Extension
                    <ExternalLink size={14} className="transition-transform group-hover:scale-110" />
                  </button>
                ) : extensionStatus === 'idle' ? (
                  <button 
                    onClick={() => setExtensionStatus('recording')}
                    className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-all duration-200 font-medium hover:gap-2"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button 
                    onClick={() => setExtensionStatus('idle')}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-all duration-200 font-medium hover:gap-2"
                  >
                    Stop Recording
                  </button>
                )}
                <div className="absolute left-0 -bottom-1 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#2a2a2b] text-xs text-zinc-300 px-3 py-2 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                  {extensionStatus === 'not_installed' ? 'Install our browser extension to record and transcribe your meetings' :
                   extensionStatus === 'idle' ? 'Click to start recording your meeting' :
                   'Recording in progress - click to stop'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <History size={16} />
            <span className="text-sm font-medium tracking-wide">Recent Activities</span>
          </div>
          <button className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            View All
          </button>
        </div>

        <Section />
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
