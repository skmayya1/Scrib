import { authClient } from "@/lib/auth-client";
import React from "react";

const Navbar = () => {
  const {  data: session } = authClient.useSession();
  return (
    <nav className="h-[100px] w-full items-center justify-between">
      <div className="MAXWIDTH h-full">
        <div className="flex items-center justify-between w-full ">
          <h1 className="text-2xl font-bold">SCRIB</h1>
        </div>
        <div className="flex items-center justify-end w-full">
          <div className="">
            {session && (
              <div className="flex items-center justify-center gap-3.5 text-zinc-300 font-semibold text-[14px]">
                <div className="text-zinc-300 flex gap-6">
                  <span>{session.user.name}</span>
                </div>
                <div className="w-8 h-8 text-sm flex items-center justify-center rounded-md bg-zinc-700 text-zinc-300 font-semibold select-none">
                  {session?.user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
