import React, { useEffect, useState } from "react";
import axios from "axios";

interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const Section = () => {
  const [Data, setData] = useState<Activity[] | null>(null);

  useEffect(() => {
    const FetchData = async () => {
      const response = await axios.get("/api/activity");
      const data = response.data; // No need for `await` here
      console.log(data); // Check what the API is returning

      // Ensure you're setting the array correctly
      setData(data.data);
    };

    FetchData();
  }, []);

  return (
    <div className="min-h-[20%] w-full grid grid-cols-4 gap-4">
      {Data &&
        Data.map((activity) => (
          <div
            key={activity.id}
            className="bg-[#242425] rounded-lg h-full cursor-pointer  hover:bg-[#272626]
      "
          >
            <div className="p-4">
              <h1 className="text-2xl text-zinc-500 font-medium line-clamp-2 antialiased">
                {activity.title}
              </h1>
              <p className="text-sm text-zinc-600 mt-2 line-clamp-3 antialiased">
                {activity.description}
              </p>
              <span className="text-sm text-zinc-500 font-medium w-full flex justify-end antialiased">
                {activity.createdAt}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Section;
