import prisma from "@/DB/prisma";
import { NextResponse } from "next/server";

export async function POST({ params }: { params: {slug:string} }) {
    const { slug } = await params;

    try {
        const MeetData = await prisma.meetings.findUnique({
            where: {
                id: slug
            },
            select: {
                Text: true,
                id: true,
            }
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occured" }, { status: 500 });
    }
}