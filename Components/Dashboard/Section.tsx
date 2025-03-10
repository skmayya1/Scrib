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

interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export function formatDate(timestamp: string) {
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

const Section = () => {
  const router = useRouter()
  const [Data, setData] = useState<Activity[] | null>(null);

  useEffect(() => {
    const FetchData = async () => {
      const response = await axios.get("/api/activity");
      const { data, messsage } = response.data;
      console.log(data);

      console.log(messsage);

      setData(data);
    };

    FetchData();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Data &&
        Data.map((activity) => (
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
    </div>
  );
};

export default Section;
