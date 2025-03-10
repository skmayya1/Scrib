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
  setMeetingData: (data: MeetingData) => void;
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
      const response = await fetch(`/api/activity/${meetingsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: setting === "isPublic",
          Editable: setting === "Editable",
        }),
      });

      if (response.ok) {
        setSettings((prev) => ({
          ...prev,
          [setting]: !prev[setting],
        }));
        setMeetingData({
          ...meetingData,
          [setting]: !settings[setting],
        });
      }
    } catch (error) {
      console.error(`Failed to update ${setting}:`, error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/activity/${meetingsId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMeetingData(null);
      }
    } catch (error) {
      console.error("Failed to delete meeting:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-8 right-5 h-fit w-[180px] bg-[#19191a] border border-[#242425] rounded-lg flex flex-col items-start justify-center px-3 py-2 gap-1"
    >
      <div className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-2 text-sm text-zinc-500 hover:bg-[#242425] rounded-lg w-full min-w-[150px]">
        <input
          type="checkbox"
          id="public-checkbox"
          checked={settings.isPublic}
          onChange={() => handleSettingChange("isPublic")}
          className="peer hidden"
        />
        <label
          htmlFor="public-checkbox"
          className="mr-2 h-3 w-3 rounded border border-zinc-700 bg-gray-500 peer-checked:bg-green-500"
        />
        <Globe size={12} color="gray" />
        <span>Public access</span>
      </div>

      <div className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-2 text-sm text-zinc-500 hover:bg-[#242425] rounded-lg w-full min-w-[150px]">
        <input
          type="checkbox"
          id="editable-checkbox"
          checked={settings.Editable}
          onChange={() => handleSettingChange("Editable")}
          disabled={!settings.isPublic}
          className="peer hidden"
        />
        <label
          htmlFor="editable-checkbox"
          className={`mr-2 h-3 w-3 rounded border border-zinc-700 
      peer-checked:bg-blue-500 peer-disabled:bg-zinc-700 bg-gray-500`}
        />
        <Edit2Icon size={12} color="gray" />
        <span className={!settings.isPublic ? "text-zinc-600" : ""}>
          Anyone can edit
        </span>
      </div>

      <button className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-2 text-sm text-zinc-500 hover:bg-[#242425] rounded-lg w-full min-w-[150px]">
        <CircleHelp size={12} color="gray" />
        Help
      </button>

      <button
        onClick={() => {
          setdeleteModal(!deleteModal);
          setMenuIsOpen(false);
        }}
        className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-2 text-sm text-[#990000] hover:bg-[#99000035] rounded-lg w-full min-w-[150px]"
      >
        <Trash size={12} color="#990000" />
        Delete
      </button>
    </div>
  );
};

export default MenuToggle;
