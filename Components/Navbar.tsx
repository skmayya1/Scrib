import { authClient } from "@/lib/auth-client";
import React, { useState, useRef, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <nav className="h-[100px] w-full items-center justify-between">
      <div className="MAXWIDTH h-full">
        <div className="flex items-center justify-between w-full ">
          <h1 className="text-2xl font-bold">SCRIB</h1>
        </div>
        <div className="flex items-center justify-end w-full">
          <div className="">
            {session && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center gap-3.5 text-zinc-300 font-semibold text-[14px] hover:text-white transition-colors"
                >
                  <div className="text-zinc-300 flex gap-6 hover:text-white transition-colors">
                    <span>{session.user.name}</span>
                  </div>
                  <div className="w-8 h-8 text-sm flex items-center justify-center rounded-md bg-zinc-700 text-zinc-300 font-semibold select-none hover:bg-zinc-600 transition-colors">
                    {session?.user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                <div className={`absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50 transform transition-all duration-200 ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} z-99`}>
                  <div className="p-1.5">
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 group"
                      onClick={() => {
                        // Handle preferences click
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Settings size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Preferences</span>                      </div>
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400/80 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200 group"
                      onClick={() => {
                        authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              router.push("/login"); // redirect to login page
                            },
                          },
                        });
                        setIsDropdownOpen(false);
                      }}
                    >
                      <LogOut size={16} className="text-red-500/50 group-hover:text-red-400 transition-colors duration-200" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Sign out</span>
                      </div>
                    </button>
                  </div>
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
