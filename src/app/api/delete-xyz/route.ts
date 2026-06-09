import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Delete reviews referencing PGs with name "xyz"
    const pgsToDelete = await prisma.pG.findMany({
      where: {
        OR: [
          { name: { contains: "xyz", mode: "insensitive" } },
          { id: { contains: "xyz" } },
          { minRent: 49999 }
        ]
      }
    });

    const ids = pgsToDelete.map(p => p.id);

    if (ids.length > 0) {
      // Clean up relations
      await prisma.review.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.room.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.booking.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.favorite.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.inquiry.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.visitschedule.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.pGCollege.deleteMany({ where: { pgId: { in: ids } } });
      await prisma.foodMenu.deleteMany({ where: { pgId: { in: ids } } });

      const deleteResult = await prisma.pG.deleteMany({
        where: { id: { in: ids } }
      });

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deleteResult.count} PG(s) with IDs: ${ids.join(", ")}`
      });
    }

    return NextResponse.json({
      success: true,
      message: "No PGs matching 'xyz' or rent 49999 found in the database."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
