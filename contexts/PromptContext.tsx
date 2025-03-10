import { useParams } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PromptContextType {
  prompt: string;
  showChat: boolean;
  loading: boolean;
  message: string | null;
  data: string;
  prevPrompt: string;
  deleteModal: boolean;
  setdeleteModal: (deleteModal: boolean) => void;
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
  const [Data, setData] = useState<string>("");
  const [prevPrompt, setprevPrompt] = useState('')
  const [deleteModal, setdeleteModal] = useState(false)

  const { slug } = useParams();

  const handlePromptSubmit = async () => {
    if (prompt.trim()) {
      setloading(true);
      setprevPrompt('')
      setData("");
      setMessage(null);
      setshowChat(false);
      const response = await fetch(`/api/activity/${slug}/chat`, {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log(data.data);
      setData(data.data);
      setloading(false);
      setshowChat(true);
      setprevPrompt(prompt);
      setPrompt("");

    }
  };

  const value = {
    prompt,
    setPrompt,
    handlePromptSubmit,
    showChat,
    setshowChat,
    deleteModal,
    setdeleteModal,
    loading,
    message,
    data: Data,
    prevPrompt
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
