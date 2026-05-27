import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalOwners,
      totalPGs,
      pendingApprovals,
      totalBookings,
      newUsersThisMonth,
      activeStudents,
      revenueData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.ownerAccount.count(),
      prisma.pG.count({ where: { status: "ACTIVE" } }),
      prisma.pG.count({ where: { status: "PENDING" } }),
      prisma.booking.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { role: "STUDENT", status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ]);

    const totalRevenue = (revenueData._sum.amount || 0) / 100; // paise to rupees

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalPGs,
        pendingApprovals,
        totalBookings,
        totalRevenue,
        activeStudents,
        newUsersThisMonth,
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
