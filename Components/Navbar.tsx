import { authClient } from "@/lib/auth-client";
import React, { useState, useRef, useEffect } from "react";
import { Settings, LogOut, User, CreditCard, Shield, ChevronRight, Mail, Image, Globe2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal = ({ isOpen, onClose }: PreferencesModalProps) => {
  const [activeSection, setActiveSection] = useState('general');
  const { data: session } = authClient.useSession();

  if (!isOpen) return null;

  const sections = {
    general: {
      title: 'General',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-zinc-400">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-300">{session?.user?.name}</h3>
                <p className="text-sm text-zinc-500">{session?.user?.email}</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <Image size={16} />
                <span>Change profile photo</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>Update email preferences</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )
    },
    plan: {
      title: 'Plan',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-300">Current Plan</h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Free</span>
            </div>
            <p className="text-sm text-zinc-500 mb-4">5 meetings per month</p>
            <button className="w-full bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade to Pro
            </button>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-400">Plan Features</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <span>• 5 meetings/month</span>
              </li>
              <li className="flex items-center gap-2">
                <span>• Basic meeting features</span>
              </li>
              <li className="flex items-center gap-2">
                <span>• 7-day meeting history</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    security: {
      title: 'Security & Privacy',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Default Meeting Privacy</label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-zinc-400" />
                  <span className="text-sm text-zinc-300">Make meetings private by default</span>
                </div>
                <button className="w-11 h-6 rounded-full bg-zinc-700 relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-1" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Default Meeting Access</label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className="text-zinc-400" />
                  <span className="text-sm text-zinc-300">Allow others to edit by default</span>
                </div>
                <button className="w-11 h-6 rounded-full bg-zinc-700 relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl h-[400px] flex overflow-hidden border border-zinc-800/50">
        {/* Sidebar */}
        <div className="w-48 border-r border-zinc-800 p-2">
          {Object.entries(sections).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  activeSection === key
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                } transition-colors`}
              >
                <Icon size={16} />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-200">{sections[activeSection as keyof typeof sections].title}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {sections[activeSection as keyof typeof sections].content}
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
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
    <>
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
                          setIsPreferencesOpen(true);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Settings size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Preferences</span>
                        </div>
                      </button>
                      <button
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400/80 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200 group"
                        onClick={() => {
                          authClient.signOut({
                            fetchOptions: {
                              onSuccess: () => {
                                router.push("/"); 
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
      <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
    </>
  );
};

export default Navbar;
