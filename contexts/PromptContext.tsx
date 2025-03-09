import React, { createContext, useContext, useState, ReactNode } from "react";

interface PromptContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handlePromptSubmit: () => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
    const [prompt, setPrompt] = useState<string>("");
    const [loading, setloading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

  const handlePromptSubmit = () => {
    if (prompt.trim()) {
        alert(prompt); 
      setPrompt("");
    }
  };
  
    const FetchData = async () => {
        setloading(true);
        
    }

  const value = {
    prompt,
    setPrompt,
    handlePromptSubmit,
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
