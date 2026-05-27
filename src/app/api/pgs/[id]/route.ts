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

    const pg = await prisma.pG.update({
      where: { id },
      data: body,
    });

    return NextResponse.json<ApiResponse>({ success: true, data: pg });
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
    await prisma.pG.delete({ where: { id } });
    return NextResponse.json<ApiResponse>({ success: true, message: "PG deleted" });
  } catch (error) {
    console.error("[PG_DELETE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete PG" },
      { status: 500 }
    );
  }
}
