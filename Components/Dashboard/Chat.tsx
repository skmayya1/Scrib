import { usePrompt } from "@/contexts/PromptContext";
import { MoveUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chat = () => {
  const { showChat, setshowChat, data ,loading , prevPrompt} = usePrompt();

  return (
    <div
      className={`flex flex-col gap-1 cursor-pointer rounded-lg bg-[#242425] self-start  items-center justify-start text-sm shadow-md border border-zinc-700 shadow-zinc-800 text-zinc-400 transition-all  ease-in-out z-10
     ${showChat ? "w-full min-h-[350px] h-fit max-h-[580px]" : " h-9 w-36"} ${
        data || loading ? "block" : "hidden"
      }
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
          {loading
            ? "Thinking.."
            : `
          ${!showChat && data ? "Show response" : ""}
          `}{" "}
          <MoveUpRight size={13} />
        </p>
        {!showChat && data && (
          <span className="absolute z-20 h-2 w-2 bg-zinc-400 rounded-full -top-1 right-0 " />
        )}
      </button>
      {showChat && (
        <div className="flex items-start px-5 py-4 w-full  h-full  text-base justify-start font-medium flex-col gap-3  overflow-auto custom-scrollbar">
          <p
            className="text-zinc-400 w-full flex items-center justify-end text-md 
          border-b border-dashed border-zinc-700 px-4 font-normal py-3 "
          >
            {prevPrompt}
          </p>
          {data && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="text-zinc-400  w-full">{children}</p>
                ),
                div: ({ children }) => (
                  <div className="text-zinc-400 gap-4 flex flex-col  w-full">
                    {children}
                  </div>
                ),
                h1: ({ children }) => (
                  <h1 className="text-zinc-400 text-xl font-bold my-1 w-full">
                    {children}
                  </h1>
                ),
              }}
            >
              {data}
            </ReactMarkdown>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
