import prisma from "@/DB/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params; // Extract slug from params

  console.log("slug", slug);

  if (!slug) {
    return NextResponse.json({ message: "No slug provided" }, { status: 400 });
  }

  const data = await prisma.meetings.findUnique({
    where: {
      id: slug,
    },
    select: {
      title: true,
      description: true,
      keytakeaways: true,
      tasks: true,
      id: true,
      deadlines: true,
      createdAt: true,
    },
  });
  return NextResponse.json(data, { status: 200 });
}
