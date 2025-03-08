"use client";
import { formatDate } from "@/Components/Dashboard/Section";
import Navbar from "@/Components/Navbar";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Input from "@/Components/Dashboard/Input";
import { Share, Ellipsis, ChevronLeft, NotebookPen } from "lucide-react";

interface Task {
  task: string;
  id: string;
  createdAt: string;
  updatedAt: Date;
  assigned_to: string | null;
  deadline: string | null;
  meetingId: string;
}

interface MeetingData {
  id: string;
  title: string | null;
  description: string | null;
  keytakeaways: string[];
  deadlines: string[];
  createdAt: Date | null;
  tasks: Task[];
}

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

  useEffect(() => {
    const fetchMeetingData = async () => {
      if (slug) {
        console.log("slug", slug);
        const response = await fetch(`/api/activity/${slug}`);
        const data: MeetingData = await response.json();
        setMeetingData(data);
      }
    };

    fetchMeetingData();
  }, [slug]);

  return (
    <div className="bg-[#191818]  min-h-screen flex flex-col justify-start  w-full ">
      <Navbar />

      {meetingData ? (
        <div className="flex w-full items-center flex-col justify-between MAXWIDTH">
          <div className="flex w-full items-center justify-between">
            <button
              onClick={() => {
                router.push("/dashboard");
              }}
              className="w-full cursor-pointer self-start text-sm text-zinc-300 flex items-center justify-start gap-2 "
            >
              <ChevronLeft size={13} color="gray" />
              Back
            </button>
            <div className="flex gap-5 items-center pr-5">
              <button className="flex  items-center hover:bg-[#111] text-sm  border border-zinc-800 rounded-lg px-2 py-1 text-zinc-400 cursor-pointer gap-2">
                <Share size={13} color="gray" />
                Share
              </button>
              <button className="w-full cursor-pointer items-center text-sm text-zinc-300 flex   gap-2 ">
                <Ellipsis size={19} color="gray" />
              </button>
            </div>
          </div>
          <div className=" h-full flex w-full  py-16 gap-7">
            <div className="w-[66%] flex items-start justify-start flex-col gap-10">
              <div className="w-full self-start flex items-start justify-start  flex-col gap-4">
                <h1 className="text-3xl font-semibold text-zinc-300 line-clamp-2">
                  {meetingData.title}
                </h1>
                {meetingData.createdAt && (
                  <p className="text-sm text-zinc-400 tracking-wider ml-1 font-semibold">
                    {formatDate(meetingData.createdAt)}
                  </p>
                )}
              </div>
              <div className="w-full flex items-start justify-start self-start flex-col gap-4 ">
                {meetingData.keytakeaways.length > 0 && (
                  <div className="w-full flex items-start justify-start flex-col gap-4">
                    <h2 className="text-xl font-semibold text-zinc-400 flex gap-2 items-center">
                      Key Takeaways <NotebookPen size={12} />
                    </h2>
                    <ul className="w-full flex items-start justify-start flex-col gap-2">
                      {meetingData.keytakeaways.map((keytakeaway, index) => (
                        <li
                          key={index}
                          className="text-lg text-zinc-400  ml-1 font-light tracking-wider flex gap-2 items-start  "
                        >
                          <Image
                            className="mt-2"
                            src="/dot-white.png"
                            width={12}
                            height={12}
                            alt="dot"
                          />
                          {keytakeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start justify-start w-[30%] ">
              <div className="border border-zinc-800  bg-[#1c1c1cfc] w-full h-fit p-4 flex items-start justify-start flex-col gap-4 rounded-lg">
                {meetingData.deadlines.length > 0 ? (
                  <div className="w-full flex items-start justify-start flex-col gap-4 h-fit p-2">
                    <h2 className="text-xl font-semibold text-zinc-300">
                      Deadlines
                    </h2>
                    <ul className="w-full flex items-start justify-start flex-col gap-2">
                      {meetingData.deadlines.map((deadline, index) => (
                        <li
                          key={index}
                          className="text-lg text-zinc-400  ml-1 font-semibold tracking-wider flex gap-2 items-center "
                        >
                          {deadline}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="w-full flex items-start justify-center flex-col gap-4">
                    <h2 className="text-lg font-semibold text-zinc-400">
                      Deadlines
                    </h2>

                    <p className="text-sm text-zinc-500  ml-1 font-semibold tracking-wider flex gap-2 items-center ">
                      No deadlines
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-zinc-800 bg-[#1c1c1cfc] divide-y divide-zinc-800 rounded-lg">
              <thead>
                <tr>
                  <th className="w-12"></th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-400 uppercase tracking-wider max-w-md w-[45%]">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-400 tracking-wider max-w-xs w-[25%]">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-400 tracking-wider max-w-xs w-[20%]">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#1c1c1cfc] divide-y divide-zinc-800 w-full">
                {meetingData.tasks.length > 0 ? (
                  meetingData.tasks.map((task, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-[#1c1c1cfc] w-full"
                          : "bg-[#1c1c1cfc] w-full"
                      }
                    >
                      <td className="pl-4 py-4 whitespace-nowrap text-sm text-zinc-500 w-12">
                        <span className="border-zinc-700 rounded-[2px] border w-fit p-1.5 block bg-[#242424fc]" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold max-w-3xl  text-zinc-500 truncate">
                        {task.task}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs  text-zinc-500 truncate">
                        {task.assigned_to || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs text-zinc-500 truncate">
                        {task.deadline || "No deadline"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="w-full">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 w-12">
                      <span className="border-zinc-700 rounded-[2px] border w-fit p-1.5 block bg-[#242424fc]" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold max-w-3xl  text-zinc-500 truncate">
                      No tasks
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-xs  text-zinc-500 truncate">
                      Unassigned
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-xs text-zinc-500 truncate">
                      No deadline
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="MAXWIDTH">Loading...</div>
      )}
      <div className="MAXWIDTH fixed bottom-0 right-0 left-0 ">
        <Input placeholder="Ask me anything from this discussion!" needShadow />
      </div>
    </div>
  );
};

export default Page;
