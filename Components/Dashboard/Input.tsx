import React from "react";
import { ChevronRight } from "lucide-react";

const Input = () => {
  return (
    <div className="w-full h-[25%] bg-[#242425] rounded-lg flex items-center justify-between px-2">
      <input
        className="h-full w-[99%] outline-0 p-4 text-sm text-zinc-300 placeholder:tracking-wide tracking-wider"
        placeholder="Looking for a past meeting?"
        type="text"
      />
      <ChevronRight size={20} color="gray" />
    </div>
  );
};

export default Input;
