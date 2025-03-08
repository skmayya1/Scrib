import prisma from "@/DB/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized", data: [] },
      { status: 401 }
    );
  }
  const Meetings = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      meetings: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      message: "Meetings fetched successfully",
      data: Meetings?.meetings,
    },
    { status: 200 }
  );
}
