import prisma from "@/DB/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
      Editable: true,
      isPublic: true,
      id: true,
      deadlines: true,
      createdAt: true,
    },
  });
  //is public condition goes here
  return NextResponse.json(data, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    const { isPublic, Editable } = await req.json();
    console.log(isPublic, Editable);

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log(slug);

    const user = await prisma.meetings.findUnique({
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
      },
    });
    console.log(user);

    if (session?.user.email != user?.user.email && !user?.Editable) {
      return NextResponse.json(
        {
          message: "forbidden",
        },
        { status: 403 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "No document ID provided" },
        { status: 400 }
      );
    }
    console.log("valid br");

    await prisma.meetings.update({
      where: {
        id: slug,
      },
      data: {
        isPublic: isPublic ? !user?.isPublic : user?.isPublic,
        Editable: Editable ? !user?.Editable : user?.Editable,
      },
    });

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating document visibility:", error);
    return NextResponse.json(
      { message: "Failed to update document visibility" },
      { status: 500 }
    );
  }
}
