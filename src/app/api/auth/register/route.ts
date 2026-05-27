import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Students can self-register; owners need admin creation (or can request)
    const userRole = role === "PG_OWNER" ? "PG_OWNER" : "STUDENT";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: userRole,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: user, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
