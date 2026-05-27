import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";

// GET single owner
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const owner = await prisma.ownerAccount.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true, status: true, createdAt: true } },
        pgs: {
          select: { id: true, name: true, status: true, rating: true, availableRooms: true },
        },
      },
    });

    if (!owner) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Owner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: owner });
  } catch (error) {
    console.error("[OWNER_GET]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch owner" },
      { status: 500 }
    );
  }
}

// PATCH - Update owner or suspend/activate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, name, email, phone, newPassword } = body;

    const owner = await prisma.ownerAccount.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!owner) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Owner not found" },
        { status: 404 }
      );
    }

    // Handle specific actions
    if (action === "suspend") {
      await prisma.user.update({
        where: { id: owner.userId },
        data: { status: "SUSPENDED" },
      });
      return NextResponse.json<ApiResponse>({ success: true, message: "Owner suspended" });
    }

    if (action === "activate") {
      await prisma.user.update({
        where: { id: owner.userId },
        data: { status: "ACTIVE" },
      });
      return NextResponse.json<ApiResponse>({ success: true, message: "Owner activated" });
    }

    if (action === "reset_password") {
      const rawPassword = `Owner@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const hashed = await bcrypt.hash(rawPassword, 12);
      await prisma.user.update({
        where: { id: owner.userId },
        data: { password: hashed },
      });
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Password reset",
        data: { newPassword: rawPassword },
      });
    }

    // General update
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (newPassword) updates.password = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: owner.userId },
      data: updates,
    });

    return NextResponse.json<ApiResponse>({ success: true, message: "Owner updated" });
  } catch (error) {
    console.error("[OWNER_UPDATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update owner" },
      { status: 500 }
    );
  }
}

// DELETE owner account
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const owner = await prisma.ownerAccount.findUnique({
      where: { id },
    });

    if (!owner) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Owner not found" },
        { status: 404 }
      );
    }

    // Cascade delete user (prisma handles onDelete: Cascade for ownerAccount)
    await prisma.user.delete({ where: { id: owner.userId } });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Owner account permanently deleted",
    });
  } catch (error) {
    console.error("[OWNER_DELETE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete owner" },
      { status: 500 }
    );
  }
}
