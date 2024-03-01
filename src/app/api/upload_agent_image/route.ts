import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("image") as unknown as File;

  if (!file) {
    return NextResponse.json({
      success: false,
      error: "There is no file or the file is corrupted",
    });
  }

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${uuidv4()}-${new Date().getTime()}-${file.name}`;
  const storagePath = path.join(
    process.cwd(),
    "public",
    "agents_images",
    filename
  );
  fs.writeFileSync(storagePath, buffer, { flag: "w" });

  const imageURL = `/agents_images/${filename}`;
  await prisma.agent.update({
    // @ts-ignore
    where: { id: Number.parseInt(data.get("agent_id")) },
    data: {
      image: imageURL,
    },
  });

  return NextResponse.json({ success: true, url: imageURL });
}
