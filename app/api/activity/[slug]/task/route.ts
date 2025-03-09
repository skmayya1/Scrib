import prisma from "@/DB/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT({
  params,
  req,
}: {
  params: { slug: string };
  req: NextRequest;
}) {
  const { taskId } = await req.json();
  const { slug } = await params;

  console.log("updating task..", slug);

  const task = await prisma.meetings.findUnique({
    where: {
      id: slug,
    },
    select: {
      Editable: true,
      tasks: {
        where: {
          id: taskId,
        },
        select: {
          isCompleted: true,
        },
      },
    },
  });

  if (!task?.Editable) {
    return NextResponse.json({
      messsage: "Meetings cannot be edited",
    });
  }

  // Get current completion status
  const currentStatus = task.tasks[0]?.isCompleted || false;

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId ,
    },
    data: {
      isCompleted: !currentStatus,
    },
  });

  return NextResponse.json({
    message: "Task updated successfully",
    task: updatedTask,
  });
}
