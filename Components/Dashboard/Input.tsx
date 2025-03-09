import React from "react";
import { ChevronRight } from "lucide-react";
import { usePrompt } from "../../contexts/PromptContext";

const Input = ({
  placeholder,
  needShadow,
  isGlobal = false,
}: {
  placeholder: string;
  needShadow?: boolean;
  isGlobal: boolean;
}) => {
  const { prompt, setPrompt, handlePromptSubmit } = usePrompt();

  return (
    <div
      className={`w-full h-[25%] bg-[#242425] rounded-lg flex items-center justify-between px-2 z-10 ${
        needShadow ? "shadow shadow-zinc-800" : ""
      }`}
    >
      <input
        className="h-full w-[99%] outline-0 p-4 text-sm text-zinc-300 placeholder:tracking-wide tracking-wider"
        placeholder={placeholder}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handlePromptSubmit();
          }
        }}
      />
      <button
        className="h-full w-10 flex items-center justify-center cursor-pointer"
        onClick={handlePromptSubmit}
      >
        <ChevronRight size={20} color="gray" />
      </button>
    </div>
  );
};

export default Input;
