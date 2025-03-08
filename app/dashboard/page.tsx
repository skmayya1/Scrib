"use client";
import Input from "@/Components/Dashboard/Input";
import Section from "@/Components/Dashboard/Section";
import Navbar from "@/Components/Navbar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { History } from 'lucide-react';

const Page = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  if (!isPending && !session) {
    router.push("/auth/login");
  }
  console.log(session);

  return (
    <div className="bg-[#191818] max-h-screen h-screen  w-full overflow-hidden">
      <Navbar />
      <div className="MAXWIDTH h-full flex-col py-20">
        {/*   <Section /> */}
        <div className="h-[20%] w-full max-w-[800px] flex items-center justify-center gap-3.5">
          <Input placeholder="Looking for a past meeting?" />
          <div className="w-[25%] h-[25%] bg-[#242425] rounded-lg flex items-center justify-center gap-3 px-2 text-zinc-400">
            <div className="h-2 w-6 opacity-70 bg-green-500 rounded-full animate-slime"></div>
            Recording
          </div>
        </div>
        <div className="w-full flex items-center text-[13px] text-zinc-400 justify-start mb-4 tracking-wider">
          <p className="flex items-center gap-2">
            <History color="gray" size={14}/>
            Activities
          </p>
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
