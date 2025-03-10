"use client";
import { formatDate } from "@/Components/Dashboard/Section";
import Navbar from "@/Components/Navbar";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Input from "@/Components/Dashboard/Input";
import {
  Share,
  Ellipsis,
  ChevronLeft,
  NotebookPen,
  Calendar,
  Globe,
  Lock,
  Edit,
  ClipboardList,
  UserCircle,
} from "lucide-react";

import MenuToggle from "@/Components/Dashboard/MenuToggle";
import Chat from "@/Components/Dashboard/Chat";
import DeleteModal from "@/Components/Dashboard/DeleteModal";
import { usePrompt } from "@/contexts/PromptContext";

interface Task {
  task: string;
  id: string;
  createdAt: string;
  updatedAt: Date;
  assigned_to: string | null;
  deadline: string | null;
  meetingId: string;
  isCompleted: boolean;
}

export interface MeetingData {
  id: string;
  title: string | null;
  description: string | null;
  keytakeaways: string[];
  deadlines: string[];
  createdAt: Date | null;
  tasks: Task[];
  isPublic: boolean;
  Editable: boolean;
}

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { deleteModal } = usePrompt();

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

  console.log(meetingData?.deadlines);

  const setData = (data: MeetingData | null) => {
    setMeetingData(data);
  };

  const handleTaskToggle = async (taskId: string) => {
    try {
      if (taskId) {
        const response = await fetch(`/api/activity/${slug}/task`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId: taskId }),
        });

        if (response.ok) {
          // Update the local state to reflect the change
          setMeetingData((prev) => {
            if (!prev) {
              return prev;
            }
            return {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isCompleted: !task.isCompleted }
                  : task
              ),
            };
          });
        }
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="bg-[#191818] min-h-screen flex flex-col w-full pb-32 relative">
      <Navbar />

      {meetingData ? (
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full py-6">
          <div className="flex w-full items-center justify-between mb-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group w-[130px]"
              >
                <Share size={15} className="text-zinc-500 group-hover:text-zinc-400 transition-colors shrink-0" />
                <span className="relative w-full">
                  <span className={`absolute inset-0 flex items-center justify-start whitespace-nowrap transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                    Copied!
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-start whitespace-nowrap transition-opacity duration-200 ${copied ? 'opacity-0' : 'opacity-100'}`}>
                    Share Meeting
                  </span>
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuIsOpen(!menuIsOpen)}
                  className="p-2 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
                >
                  <Ellipsis size={20} />
                </button>
                {menuIsOpen && (
                  <MenuToggle
                    meetingData={meetingData}
                    setMeetingData={setData}
                    meetingsId={meetingData.id}
                    setMenuIsOpen={setMenuIsOpen}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-[#1c1c1c] rounded-xl p-6 space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {meetingData.title}
                  </h1>
                  {meetingData.createdAt && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar size={14} />
                      <time className="text-sm">{formatDate(meetingData.createdAt)}</time>
                    </div>
                  )}
                </div>
                {meetingData.description && (
                  <p className="text-zinc-400 leading-relaxed">{meetingData.description}</p>
                )}
              </div>
              
              {meetingData.keytakeaways.length > 0 && (
                <div className="bg-[#1c1c1c] rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <NotebookPen size={18} />
                    <h2 className="text-lg font-semibold">Key Takeaways</h2>
                  </div>
                  <ul className="space-y-3">
                    {meetingData.keytakeaways.map((keytakeaway, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-zinc-300 group"
                      >
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <p className="text-base leading-relaxed group-hover:text-white transition-colors">
                          {keytakeaway}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-[#1c1c1c] rounded-xl p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      {meetingData.isPublic ? (
                        <>
                          <Globe size={16} className="text-green-500/80" />
                          <span className="text-sm">Public Meeting</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} className="text-zinc-400" />
                          <span className="text-sm ">Private Meeting</span>
                        </>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${meetingData.isPublic ? 'bg-green-500/5 text-green-400/80' : 'bg-zinc-800/50 text-zinc-500'}`}>
                      {meetingData.isPublic ? 'Anyone can view' : 'Only you'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Edit size={16} className={meetingData.Editable ? 'text-blue-500/80' : 'text-zinc-400'} />
                      <span className="text-sm">Edit Access</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${meetingData.Editable ? 'bg-blue-500/5 text-blue-400/80' : 'bg-zinc-800/50 text-zinc-500'}`}>
                      {meetingData.Editable ? 'Anyone can edit' : 
                       meetingData.isPublic ? 'Only you' : 'Requires public access'}
                    </div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-zinc-800/50" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar size={16} className="text-zinc-400" />
                      <span>Deadlines</span>
                    </div>
                    <div className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400">
                      {meetingData.deadlines.length} {meetingData.deadlines.length === 1 ? 'deadline' : 'deadlines'}
                    </div>
                  </div>

                  {meetingData.deadlines.length > 0 ? (
                    <ul className="space-y-2">
                      {meetingData.deadlines.map((deadline, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                        >
                          <div className="h-1 w-1 rounded-full bg-zinc-700" />
                          {deadline}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500 italic">No deadlines set</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-[#1c1c1c] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <ClipboardList size={16} className="text-zinc-400" />
                    <span>Tasks</span>
                  </div>
                  <div className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400">
                    {meetingData.tasks.length} {meetingData.tasks.length === 1 ? 'task' : 'tasks'}
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-zinc-800">
                {meetingData.tasks.length > 0 ? (
                  meetingData.tasks.map((task, index) => (
                    <div key={index} className="group p-4 hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleTaskToggle(task.id)}
                          className={`mt-1 relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${task.isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-zinc-700/50 bg-zinc-800/30'}`}
                        >
                          <div className={`h-2 w-2 rounded-sm bg-green-500 transition-opacity ${task.isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                        
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-medium ${task.isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                              {task.task}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                              <UserCircle size={14} className="text-zinc-500" />
                              <span className="text-zinc-400">{task.assigned_to || 'Unassigned'}</span>
                            </div>
                            
                            {task.deadline && (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-zinc-500" />
                                <span className="text-zinc-400">{task.deadline}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/50 mb-4">
                      <ClipboardList size={20} className="text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-400">No tasks yet</p>
                    <p className="text-xs text-zinc-500 mt-1">Tasks from the meeting will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="MAXWIDTH">Loading...</div>
      )}
      <div className="MAXWIDTH fixed bottom-0 right-0 left-0 flex flex-col items-center justify-center gap-2 ">
        <div className="absolute w-full h-full bg-[#18181874] blur  z-0" />
        <Chat />
        <Input
          placeholder="Ask me anything from this discussion!"
          needShadow
        />
      </div>
      {deleteModal && (
        <div
          className="fixed inset-0 isolate"
          style={{ perspective: "1000px" }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs z-40"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <DeleteModal meetingId={slug as string} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
