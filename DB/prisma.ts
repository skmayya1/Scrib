import { PrismaClient } from "@prisma/client";
import { MeetingsExtension } from "./extensions";
 
const prisma = new PrismaClient().$extends(MeetingsExtension);

export default prisma;