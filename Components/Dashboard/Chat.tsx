import { usePrompt } from "@/contexts/PromptContext";
import { MoveUpRight } from "lucide-react";

const Chat = () => {

  const { showChat, setshowChat } = usePrompt(); 
  
  return (
    <div
      className={`flex flex-col gap-4 cursor-pointer rounded-lg bg-[#242425] self-start  items-center justify-between text-sm shadow-md border border-zinc-700 shadow-zinc-800 text-zinc-400 transition-all  ease-in-out z-10
     ${showChat ? "w-full min-h-[300px]  h-fit max-h-[580px]" : " h-9 w-36"}
    `}
    >
      <button
        onClick={() => setshowChat(!showChat)}
        className={`h-10 w-full cursor-pointer  relative transition-all duration-700 ease-in-out 
          ${
            showChat
              ? "px-3 flex items-center justify-end border-b border-zinc-700 border-dashed"
              : ""
          }
          `}
      >
        <p
          className={`text-zinc-400 gap-2 flex items-center justify-center text-sm 
            ${showChat ? "rotate-180" : ""}
            `}
        >
          {!showChat && "Show response"} <MoveUpRight size={13} />
        </p>
        {!showChat && (
          <span className="absolute h-2 w-2 bg-zinc-400 rounded-full -top-1 right-0 " />
        )}
      </button>
    </div>
  );
};

export default Chat;
