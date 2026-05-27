import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { userId, pgId, rating, comment, images } = await request.json();

    if (!userId || !pgId || !rating || !comment) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check user hasn't already reviewed this PG
    const existing = await prisma.review.findUnique({
      where: { userId_pgId: { userId, pgId } },
    });

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "You have already reviewed this PG" },
        { status: 409 }
      );
    }

    // Create review and update PG rating in transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: { userId, pgId, rating, comment, images: images || [] },
      });

      // Recalculate average rating
      const reviews = await tx.review.findMany({
        where: { pgId },
        select: { rating: true },
      });

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await tx.pG.update({
        where: { id: pgId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      });

      return newReview;
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: review, message: "Review submitted" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REVIEW_CREATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get("pgId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!pgId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "pgId is required" },
        { status: 400 }
      );
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { pgId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
        },
      }),
      prisma.review.count({ where: { pgId } }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: reviews,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
