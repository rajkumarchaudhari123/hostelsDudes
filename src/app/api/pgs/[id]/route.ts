import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import { getCustomPGs } from "@/utils/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try DB: lookup by id first, then by slug
    try {
      let pg = await prisma.pG.findUnique({
        where: { id },
        include: {
          city: true,
          owner: { include: { user: { select: { name: true, image: true, phone: true } } } },
          rooms: { orderBy: { rent: "asc" } },
          reviews: { take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, image: true } } } },
          colleges: { include: { college: { select: { id: true, name: true, slug: true } } }, orderBy: { distance: "asc" } },
          foodMenu: true,
        },
      });

      // If not found by id, try by slug
      if (!pg) {
        pg = await prisma.pG.findUnique({
          where: { slug: id },
          include: {
            city: true,
            owner: { include: { user: { select: { name: true, image: true, phone: true } } } },
            rooms: { orderBy: { rent: "asc" } },
            reviews: { take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, image: true } } } },
            colleges: { include: { college: { select: { id: true, name: true, slug: true } } }, orderBy: { distance: "asc" } },
            foodMenu: true,
          },
        });
      }

      if (pg) {
        // Block xyz PGs from being accessed
        if (pg.name?.toLowerCase().includes("xyz")) {
          return NextResponse.json<ApiResponse>({ success: false, error: "PG not found" }, { status: 404 });
        }
        prisma.pG.update({ where: { id: pg.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
        return NextResponse.json<ApiResponse>({ success: true, data: pg });
      }
    } catch (dbErr) {
      console.warn("[PG_DETAIL] DB offline, trying JSON fallback");
    }

    // JSON fallback — search by id or slug
    const customPgs = getCustomPGs();
    const found = customPgs.find((p: any) => p.id === id || p.slug === id);
    if (found) {
      const shaped = {
        ...found,
        city: { name: "Pune", slug: "pune" },
        owner: { id: found.ownerId || "owner-1", adminId: "HD-OWNER", user: { name: "PG Owner", image: null, phone: found.phone || "" } },
        rooms: [], reviews: [], colleges: [], foodMenu: [],
        rating: found.rating || 0, reviewCount: found.reviewCount || 0,
        verified: found.verified ?? true, featured: found.featured ?? false,
        deposit: found.deposit || 0, noticePeriod: found.noticePeriod || 30,
        whatsapp: found.whatsapp || found.phone || "",
      };
      return NextResponse.json<ApiResponse>({ success: true, data: shaped });
    }

    return NextResponse.json<ApiResponse>({ success: false, error: "PG not found" }, { status: 404 });
  } catch (error) {
    console.error("[PG_DETAIL]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch PG" }, { status: 500 });
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. Try JSON storage update
    try {
      const { getCustomPGs, saveCustomPGs } = await import("@/utils/storage");
      const customPgs = getCustomPGs();
      const idx = customPgs.findIndex((p: any) => p.id === id || p.slug === id);
      if (idx !== -1) {
        customPgs[idx] = { ...customPgs[idx], ...body };
        saveCustomPGs(customPgs);
      }
    } catch (e) {
      console.warn("Skipping JSON update inside PATCH", e);
    }

    // 2. Try DB update
    let pg = null;
    try {
      pg = await prisma.pG.update({
        where: { id },
        data: body,
      });
    } catch (dbErr) {
      console.warn("DB offline during PATCH, using local fallback");
    }

    return NextResponse.json<ApiResponse>({ success: true, data: pg || body });
  } catch (error) {
    console.error("[PG_UPDATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update PG" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Delete from JSON store
    try {
      const { getCustomPGs, saveCustomPGs } = await import("@/utils/storage");
      const customPgs = getCustomPGs();
      const filtered = customPgs.filter((p: any) => p.id !== id && p.slug !== id);
      if (filtered.length !== customPgs.length) {
        saveCustomPGs(filtered);
      }
    } catch (e) {
      console.warn("Skipping JSON delete inside DELETE", e);
    }

    // 2. Delete from DB
    try {
      // Delete any related records first if there are any constraints
      await prisma.review.deleteMany({ where: { pgId: id } });
      await prisma.room.deleteMany({ where: { pgId: id } });
      await prisma.booking.deleteMany({ where: { pgId: id } });
      await prisma.favorite.deleteMany({ where: { pgId: id } });
      await prisma.inquiry.deleteMany({ where: { pgId: id } });
      await prisma.visitschedule.deleteMany({ where: { pgId: id } });
      await prisma.pGCollege.deleteMany({ where: { pgId: id } });
      await prisma.foodMenu.deleteMany({ where: { pgId: id } });

      await prisma.pG.delete({ where: { id } });
    } catch (dbErr) {
      console.warn("DB PG delete failed or skipped:", dbErr);
    }

    return NextResponse.json<ApiResponse>({ success: true, message: "PG deleted" });
  } catch (error) {
    console.error("[PG_DELETE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete PG" },
      { status: 500 }
    );
  }
}
