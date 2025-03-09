import { CircleHelp, Trash, Globe, Lock } from "lucide-react";
import React, { useState } from "react";

const MenuToggle = ({ meetingsId }: { meetingsId: string }) => {
  const [isPublic, setIsPublic] = useState(false);

  const handleVisibilityChange = async () => {
    try {
      const response = await fetch(`/api/activity/${meetingsId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      if (response.ok) {
        setIsPublic(!isPublic);
      }
    } catch (error) {
      console.error("Failed to update visibility:", error);
    }
  };

  return (
    <div className="absolute top-8 right-5 h-fit w-[180px] bg-[#19191a] border border-[#242425] rounded-lg flex flex-col items-start justify-center px-3 py-2 gap-1">
      <button className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-0.5 text-sm text-zinc-500 hover:bg-[#242425] rounded-lg w-full min-w-[150px]">
        <CircleHelp size={12} color="gray" />
        Help
      </button>

      <button className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-0.5 text-sm text-[#990000] hover:bg-[#99000035] rounded-lg w-full min-w-[150px]">
        <Trash size={12} color="#990000" />
        Delete
      </button>

      <button
        onClick={handleVisibilityChange}
        className="flex items-center cursor-pointer gap-2 px-1 pr-2 py-0.5 text-sm text-zinc-500 hover:bg-[#242425] rounded-lg w-full min-w-[150px]"
      >
        {isPublic ? (
          <>
            <Globe size={12} color="gray" />
            Public
          </>
        ) : (
          <>
            <Lock size={12} color="gray" />
            Private
          </>
        )}
      </button>
    </div>
  );
};

export default MenuToggle;
