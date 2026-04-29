import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/notes
export async function GET() {
  const session = (await getServerSession(authOptions)) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(notes);
}

// POST /api/notes
export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { upserts = [], deletes = [] } = body;
    const userId = session.user.id;

    // Handle Deletes
    if (deletes.length > 0) {
      await prisma.note.deleteMany({
        where: {
          id: { in: deletes },
          userId: userId,
        },
      });
    }

    // Handle Upserts
    const results = [];
    for (const note of upserts) {
      const { id, clientId, title, content, reminder, category, tags, isFavorite, isArchived, createdAt } = note;

      const updatedNote = await prisma.note.upsert({
        where: {
          userId_clientId: {
            userId: userId,
            clientId: clientId || id,
          },
        },
        update: {
          title,
          content,
          reminder: reminder ? new Date(reminder) : null,
          category,
          tags: tags || [],
          isFavorite: !!isFavorite,
          isArchived: !!isArchived,
          updatedAt: new Date(),
        },
        create: {
          clientId: clientId || id,
          title,
          content,
          reminder: reminder ? new Date(reminder) : null,
          category,
          tags: tags || [],
          isFavorite: !!isFavorite,
          isArchived: !!isArchived,
          createdAt: createdAt ? new Date(createdAt) : new Date(),
          updatedAt: new Date(),
          userId: userId,
        },
      });
      results.push(updatedNote);
    }

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json(
      { error: "Failed to sync notes" },
      { status: 500 }
    );
  }
}
