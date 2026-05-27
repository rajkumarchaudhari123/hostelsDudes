import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateAdminId } from "@/utils";
import type { ApiResponse } from "@/types";
import { getCustomOwners, addCustomOwner } from "@/utils/storage";

// GET all owners (Super Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";

    let dbOwners: any[] = [];
    try {
      dbOwners = await prisma.ownerAccount.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true, status: true, createdAt: true } },
          _count: { select: { pgs: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.warn("Database connection offline during GET /api/owners, falling back to JSON storage only.");
    }

    // Get custom JSON owners
    const customOwners = getCustomOwners();

    // Map custom owners to match the Prisma return structure
    const mappedCustomOwners = customOwners.map(o => ({
      id: o.id,
      adminId: o.adminId,
      businessName: "Demo Business",
      city: "Pune",
      status: o.status,
      createdAt: o.joinedAt,
      user: {
        name: o.name,
        email: o.email,
        phone: o.phone,
        status: o.status,
        createdAt: o.joinedAt
      },
      _count: { pgs: o.pgCount || 0 }
    }));

    // Merge and filter
    const allOwners = [...mappedCustomOwners, ...dbOwners];
    const filteredOwners = allOwners.filter(owner => {
      if (!search) return true;
      return (
        owner.user.name?.toLowerCase().includes(search) ||
        owner.user.email?.toLowerCase().includes(search) ||
        owner.adminId.toLowerCase().includes(search)
      );
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: filteredOwners,
    });
  } catch (error) {
    console.error("[OWNERS_GET]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch owners" },
      { status: 500 }
    );
  }
}

// POST - Super Admin creates a PG owner account
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, businessName, city } = await request.json();

    if (!name || !email) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Generate credentials
    const adminId = generateAdminId();
    const rawPassword = `Owner@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    // 1. Always attempt saving to the JSON storage fallback
    const addedToJson = addCustomOwner({
      id: `ow${Date.now()}`,
      adminId,
      name,
      email,
      phone,
      password: rawPassword, // Plain text for demo credentials match in auth.ts
      pgCount: 0,
      status: "ACTIVE",
      joinedAt: new Date().toISOString()
    });

    if (!addedToJson) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "An account with this email already exists in custom storage" },
        { status: 409 }
      );
    }

    // 2. Attempt saving to actual database (wrapped in try/catch to bypass if offline)
    let dbSuccess = false;
    let userId = `user-${Date.now()}`;
    let ownerId = `owner-${Date.now()}`;

    try {
      // Check if email already exists in DB
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        const result = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              name,
              email,
              phone,
              password: hashedPassword,
              role: "PG_OWNER",
              status: "ACTIVE",
            },
          });

          const ownerAccount = await tx.ownerAccount.create({
            data: {
              userId: user.id,
              adminId,
              businessName: businessName || "Demo Business",
              city: city || "Pune",
              status: "ACTIVE",
            },
          });

          return { user, ownerAccount };
        });
        userId = result.user.id;
        ownerId = result.ownerAccount.id;
        dbSuccess = true;
      }
    } catch (dbError) {
      console.warn("Database offline during POST /api/owners, saved owner to JSON store fallback.");
    }

    // Return credentials (only time the raw password is available)
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: dbSuccess 
          ? "PG Owner account created in database and local cache successfully"
          : "PG Owner account created in local JSON fallback store successfully",
        data: {
          adminId,
          email,
          password: rawPassword, // Only returned on creation
          ownerId,
          userId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[OWNER_CREATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create owner account" },
      { status: 500 }
    );
  }
}
