import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const pgId = searchParams.get("pgId");
    const ownerId = searchParams.get("ownerId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (pgId) where.pgId = pgId;
    if (status) where.status = status;
    if (ownerId) where.pg = { ownerId };

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        pg: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: inquiries });
  } catch (error) {
    console.error("[INQUIRIES_GET]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, pgId, message } = await request.json();

    if (!userId || !pgId || !message) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "userId, pgId, and message are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: { userId, pgId, message, status: "OPEN" },
      include: {
        pg: { select: { name: true, owner: { select: { userId: true } } } },
        user: { select: { name: true } },
      },
    });

    // Notify PG owner
    await prisma.notification.create({
      data: {
        userId: inquiry.pg.owner.userId,
        type: "INQUIRY",
        title: "New Inquiry",
        message: `${inquiry.user.name} sent an inquiry for "${inquiry.pg.name}"`,
        link: `/owner/inquiries/${inquiry.id}`,
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: inquiry, message: "Inquiry sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[INQUIRY_CREATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
