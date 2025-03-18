import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isTomorrow,
} from "date-fns";
import { useRouter } from "next/navigation";
import { History, Plus, Mic } from 'lucide-react';
import { useRecording } from "@/contexts/RecordingContext";

interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export function formatDate(timestamp: string | Date) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true }); // "5 minutes ago"
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  return format(date, "d MMMM"); // "18 March"
}

const Section = ({setTrialCountMethod}: {setTrialCountMethod: (count: number) => void}) => {
  const router = useRouter();
  const { isRecording } = useRecording();
  const [Data, setData] = useState<Activity[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.get("/api/activity");
        const { data, message } = response.data;
        console.log(data);
        console.log(message);
        setData(data);
        setTrialCountMethod(data.length);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    FetchData();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-[#242425] rounded-xl overflow-hidden">
              <div className="p-5 h-full flex flex-col justify-between min-h-[200px]">
                <div className="space-y-3">
                  <div className="h-6 bg-zinc-700/30 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-zinc-700/30 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-zinc-700/30 rounded-md animate-pulse w-2/3"></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-700/50">
                  <div className="h-3 w-20 bg-zinc-700/30 rounded-full animate-pulse"></div>
                  <div className="h-5 w-16 bg-zinc-700/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!Data || Data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">No meetings yet</h3>
          <p className="text-sm text-zinc-500 text-center max-w-sm">
            Start recording your first meeting to see it appear here. Your meeting transcripts and summaries will be stored securely.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Data.map((activity) => (
            <div
              onClick={() => handleClick(activity.id)}
              key={activity.id}
              className="bg-[#242425] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:bg-[#2a2a2b] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
            >
              <div className="p-5 h-full flex flex-col justify-between min-h-[200px]">
                <div>
                  <h2 className="text-xl text-zinc-200 font-semibold line-clamp-2 antialiased mb-3">
                    {activity.title}
                  </h2>
                  <p className="text-sm text-zinc-400 line-clamp-3 antialiased">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-700/50">
                  <span className="text-xs text-zinc-500 font-medium antialiased">
                    {formatDate(activity.createdAt)}
                  </span>
                  <div className="text-xs px-2 py-1 rounded-full bg-zinc-700/30 text-zinc-400">
                    Meeting
                  </div>
                </div>
              </div>
            </div>
          ))}
          {Data && Data.length < 5 && (
            <div
              onClick={() => router.push('/record')}
              className="bg-[#242425] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:bg-[#2a2a2b] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 border border-dashed border-zinc-700/50"
            >
              <div className="p-5 h-full flex flex-col items-center justify-center min-h-[200px] gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  {isRecording ? (
                    <div className="relative">
                      <Mic className="w-6 h-6 text-red-400" />
                      <div className="absolute inset-0 w-full h-full rounded-full bg-red-500/20 animate-ping" />
                    </div>
                  ) : (
                    <Plus className="w-6 h-6 text-zinc-400" />
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-lg text-zinc-300 font-medium mb-1">
                    {isRecording ? "Recording..." : "New Meeting"}
                  </h2>
                  {!isRecording && (
                    <p className="text-sm text-zinc-500">
                      {5 - Data.length} trial {5 - Data.length === 1 ? 'meeting' : 'meetings'} left
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Section;
