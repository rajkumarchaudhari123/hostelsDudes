import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, reason } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const pg = await prisma.pG.update({
      where: { id },
      data: {
        status: action === "approve" ? "ACTIVE" : "REJECTED",
        verified: action === "approve",
      },
      include: {
        owner: { include: { user: true } },
      },
    });

    // Create notification for owner
    await prisma.notification.create({
      data: {
        userId: pg.owner.userId,
        type: "APPROVAL",
        title: action === "approve" ? "🎉 PG Listing Approved!" : "PG Listing Rejected",
        message: action === "approve"
          ? `Your PG "${pg.name}" has been verified and is now live on Hostel Dudes.`
          : `Your PG "${pg.name}" was rejected. ${reason ? `Reason: ${reason}` : "Please update the listing and resubmit."}`,
        link: `/pg/${pg.slug}`,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `PG ${action}d successfully`,
      data: pg,
    });
  } catch (error) {
    console.error("[PG_APPROVE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
