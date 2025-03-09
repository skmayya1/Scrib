import React, { createContext, useContext, useState, ReactNode } from "react";

interface PromptContextType {
  prompt: string;
  showChat: boolean;
  loading: boolean;
  message: string | null;
  setshowChat: (showChat: boolean) => void;
  setPrompt: (prompt: string) => void;
  handlePromptSubmit: () => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setloading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showChat, setshowChat] = useState(false);

  const handlePromptSubmit = () => {
    if (prompt.trim()) {

    }
  };

  const FetchData = async () => {
      setloading(true);
      
      //fetch data OK OOPEN THE CHAT
  };

  const value = {
    prompt,
    setPrompt,
    handlePromptSubmit,
    showChat,
    setshowChat,
    loading,
    message,
  };

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
}

//custom-hook
export function usePrompt() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
}
