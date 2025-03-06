import React from "react";

const Section = () => {
  return (
    <div className="h-[20%] w-full grid grid-cols-4 gap-4">
      <div
        className="bg-[#242425] rounded-lg h-full cursor-pointer  hover:bg-[#272626]
      "
      >
        <div className="p-4">
          <h1 className="text-2xl text-zinc-500 font-medium line-clamp-2 antialiased">
            Google meet about the new project
          </h1>
          <p className="text-sm text-zinc-600 mt-2 line-clamp-3 antialiased">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            tincidunt, eros nec pulvinar.
          </p>
          <span className="text-sm text-zinc-500 font-medium w-full flex justify-end antialiased">
            12 march
          </span>
        </div>
      </div>
      <div className=" h-full"></div>
      <div className=" h-full"></div>
      <div className=" h-full"></div>
    </div>
  );
};

export default Section;
