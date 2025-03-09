import prisma from "@/DB/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json(); // Parse the request body safely
    const { slug } = await params;

    const { taskId } = body;

    if (!taskId) {
      return new NextResponse("taskId is missing", { status: 400 });
    }

    console.log("taskId:", taskId);

        const session = await auth.api.getSession({
          headers: await headers(),
        });
        console.log(slug);

        const task = await prisma.meetings.findUnique({
          where: {
            id: slug,
          },
          select: {
            user: {
              select: {
                email: true,
              },
            },
            isPublic: true,
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

 

    if (!task) {
      return new NextResponse("Meeting not found", { status: 404 });
    }
    console.log("task:", task);
    
    
    if (!task.Editable && task.user.email !== session?.user.email) {
      return NextResponse.json(
        { message: "Meetings cannot be edited" },
        { status: 403 }
      );
    }

    if (!task.tasks.length) {
      return new NextResponse("Task not found", { status: 404 });
    }

    // Get current completion status
    const currentStatus = task.tasks[0].isCompleted;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: !currentStatus },
    });

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
