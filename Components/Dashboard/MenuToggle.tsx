import { MeetingData } from "@/app/dashboard/[slug]/page";
import { CircleHelp, Trash, Globe, Edit2Icon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { usePrompt } from "@/contexts/PromptContext";

const MenuToggle = ({
  meetingsId,
  setMeetingData,
  meetingData,
  setMenuIsOpen,
}: {
  meetingsId: string;
  meetingData: MeetingData;
  setMeetingData: (data: MeetingData | null) => void;
  setMenuIsOpen: (isOpen: boolean) => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteModal, setdeleteModal } = usePrompt();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuIsOpen]);

  const [settings, setSettings] = useState({
    isPublic: meetingData.isPublic,
    Editable: meetingData.Editable,
  });

  const handleSettingChange = async (setting: "isPublic" | "Editable") => {
    try {
      // Get current settings
      const currentSettings = { ...settings };
      
      // Calculate new values
      if (setting === "isPublic") {
        currentSettings.isPublic = !currentSettings.isPublic;
        // If making private, ensure Editable is false
        if (!currentSettings.isPublic) {
          currentSettings.Editable = false;
        }
      } else {
        currentSettings.Editable = !currentSettings.Editable;
      }

      const response = await fetch(`/api/activity/${meetingsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: currentSettings.isPublic,
          Editable: currentSettings.Editable
        }),
      });

      if (response.ok) {
        // Update local state
        setSettings(currentSettings);

        // Update parent state
        setMeetingData({
          ...meetingData,
          isPublic: currentSettings.isPublic,
          Editable: currentSettings.Editable
        });
        setMenuIsOpen(false);

      }
    } catch (error) {
      console.error(`Failed to update ${setting}:`, error);
    }
  };


  return (
    <div
      ref={menuRef}
      className="absolute top-8 right-0 w-[220px] bg-[#1c1c1c] border border-zinc-800/50 rounded-xl shadow-xl backdrop-blur-sm flex flex-col p-2 gap-1 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <button
        onClick={() => handleSettingChange("isPublic")}
        className="group flex items-center cursor-pointer gap-3 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/50 rounded-lg w-full transition-colors"
      >
        <div className="relative flex items-center">
          <div className={`h-4 w-4 rounded border transition-colors ${settings.isPublic ? 'border-green-500/50 bg-green-500/10' : 'border-zinc-700 bg-zinc-800'}`} />
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${settings.isPublic ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-2 w-2 rounded-sm bg-green-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Globe size={15} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
          <span className="group-hover:text-zinc-300 transition-colors">Public access</span>
        </div>
      </button>

      <button
        onClick={() => settings.isPublic && handleSettingChange("Editable")}
        className={`group flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 ${settings.isPublic ? 'hover:bg-zinc-800/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'} rounded-lg w-full transition-colors`}
      >
        <div className="relative flex items-center">
          <div className={`h-4 w-4 rounded border transition-colors ${settings.Editable && settings.isPublic ? 'border-blue-500/50 bg-blue-500/10' : !settings.isPublic ? 'bg-zinc-900 border-zinc-800' : 'border-zinc-700 bg-zinc-800'}`} />
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${settings.Editable && settings.isPublic ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-2 w-2 rounded-sm bg-blue-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Edit2Icon size={15} className={`${settings.isPublic ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-700'} transition-colors`} />
          <span className={`${settings.isPublic ? 'group-hover:text-zinc-300' : 'text-zinc-700'} transition-colors`}>
            Anyone can edit
          </span>
        </div>
      </button>

      <div className="h-[1px] w-full bg-zinc-800/50 my-1" />
      
      <button className="group flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/50 rounded-lg w-full transition-colors">
        <CircleHelp size={15} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
        <span className="group-hover:text-zinc-300 transition-colors">View Help Guide</span>
      </button>

      <button
        onClick={() => {
          setdeleteModal(!deleteModal);
          setMenuIsOpen(false);
        }}
        className="group flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors"
      >
        <Trash size={15} className="group-hover:text-red-300 transition-colors" />
        <span className="group-hover:text-red-300 transition-colors">Delete Meeting</span>
      </button>
    </div>
  );
};

export default MenuToggle;
