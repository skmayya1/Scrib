import { usePrompt } from "@/contexts/PromptContext";
import { useRouter } from "next/navigation";

const DeleteModal = ({ meetingId }: { meetingId: string }) => {
  const { setdeleteModal, deleteModal } = usePrompt();
  const router = useRouter();
  const handleDelete = async () => {
    // Delete the meeting
    await fetch(`/api/activity/${meetingId}`, {
      method: "DELETE",
    });
    router.push('/dashboard');
    setdeleteModal(!deleteModal);
  };
  return (
    <div className="h-[150px] w-[300px] bg-[#19191a] border border-[#2b2b2c] rounded-lg flex flex-col items-center justify-center gap-4 z-99 px-5">
      <div className="text-zinc-400 text-lg font-semibold">
        Are you sure you want to delete this meeting?
      </div>
      <div className="flex gap-14">
        <button
          onClick={handleDelete}
          className="bg-[#242425] text-red-600 cursor-pointer px-6 py-1 rounded-lg"
        >
          Yes
        </button>
        <button
          onClick={() => setdeleteModal(!deleteModal)}
          className="bg-[#242425] text-zinc-300 px-6 py-1 rounded-lg cursor-pointer"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
