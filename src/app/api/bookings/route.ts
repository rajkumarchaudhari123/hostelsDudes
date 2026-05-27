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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (pgId) where.pgId = pgId;
    if (status) where.status = status;

    // For owner — get bookings across all their PGs
    if (ownerId) {
      where.pg = { ownerId };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          pg: { select: { name: true, slug: true, coverImage: true, address: true } },
          room: { select: { type: true, rent: true } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: bookings,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, pgId, roomId, checkInDate, rent, deposit, notes } = body;

    if (!userId || !pgId || !checkInDate || !rent) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    // Check PG availability
    const pg = await prisma.pG.findUnique({
      where: { id: pgId },
      select: { availableRooms: true, status: true },
    });

    if (!pg || pg.status !== "ACTIVE") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "PG is not available for booking" },
        { status: 400 }
      );
    }

    if (pg.availableRooms === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No rooms available in this PG" },
        { status: 409 }
      );
    }

    const totalAmount = rent + (deposit || 0);

    const booking = await prisma.booking.create({
      data: {
        userId,
        pgId,
        roomId,
        checkInDate: new Date(checkInDate),
        rent,
        deposit,
        totalAmount,
        notes,
        status: "PENDING",
      },
      include: {
        pg: { select: { name: true, owner: { select: { userId: true } } } },
      },
    });

    // Notify owner of new booking
    await prisma.notification.create({
      data: {
        userId: booking.pg.owner.userId,
        type: "BOOKING",
        title: "New Booking Request",
        message: `You have a new booking request for "${booking.pg.name}"`,
        link: `/owner/bookings/${booking.id}`,
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: booking, message: "Booking request sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BOOKING_CREATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
