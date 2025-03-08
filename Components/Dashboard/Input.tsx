import React from "react";
import { ChevronRight } from "lucide-react";

const Input = ({
  placeholder,
  needShadow,
}: {
  placeholder: string;
  needShadow?: boolean;
}) => {
  return (
    <div
      className={`w-full h-[25%] bg-[#242425] rounded-lg flex items-center justify-between px-2 ${
        needShadow ? "shadow shadow-zinc-800" : ""
      }`}
    >
      <input
        className="h-full w-[99%] outline-0 p-4 text-sm text-zinc-300 placeholder:tracking-wide tracking-wider"
        placeholder={placeholder}
        type="text"
      />
      <ChevronRight size={20} color="gray" />
    </div>
  );
};

export default Input;
