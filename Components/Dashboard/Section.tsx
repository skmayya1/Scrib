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
    <div className="min-h-[20%] w-full grid grid-cols-4 gap-4">
      {Data &&
        Data.map((activity) => (
          <div
            onClick={() => handleClick(activity.id)}
            key={activity.id}
            className="bg-[#242425] rounded-lg h-full cursor-pointer  hover:bg-[#272626]
      "
          >
            <div className="p-4 h-full flex flex-col justify-between">
              <h1 className="text-2xl text-zinc-500 font-medium line-clamp-2 antialiased">
                {activity.title}
              </h1>
              <p className="text-sm text-zinc-600 mt-2 line-clamp-3 antialiased">
                {activity.description}
              </p>
              <span className="text-sm text-zinc-500 font-medium w-full mt-2 flex justify-end antialiased">
                {formatDate(activity.createdAt)}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Section;
