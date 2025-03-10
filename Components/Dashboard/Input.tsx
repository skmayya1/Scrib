import React from "react";
import { ChevronRight } from "lucide-react";
import { usePrompt } from "../../contexts/PromptContext";

const Input = ({
  placeholder,
  needShadow,
}: {
  placeholder: string;
  needShadow?: boolean;
}) => {
  const { prompt, setPrompt, handlePromptSubmit } = usePrompt();

  return (
    <div
      className={`w-full bg-[#242425] rounded-lg flex items-center justify-between px-3 py-2 z-10 transition-all duration-200 hover:bg-[#2a2a2b] focus-within:bg-[#2a2a2b] ${
        needShadow ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <input
        className="h-10 w-full bg-transparent outline-none text-sm text-zinc-300 placeholder:text-zinc-500 tracking-wide"
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
        className="h-10 w-10 flex items-center justify-center cursor-pointer hover:text-zinc-300 transition-colors"
        onClick={handlePromptSubmit}
      >
        <ChevronRight size={18} className="text-zinc-500" />
      </button>
    </div>
  );
};

export default Input;
