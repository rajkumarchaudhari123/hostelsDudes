import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STUDENTS_FILE = path.join(DATA_DIR, "custom_students.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readStudents(): any[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(STUDENTS_FILE)) {
      fs.writeFileSync(STUDENTS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    return JSON.parse(fs.readFileSync(STUDENTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeStudents(students: any[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
  } catch (e) {
    console.error("Failed to write students JSON:", e);
  }
}

// ─── GET: List all students ────────────────────────────────────────────────────
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.warn("DB offline for GET /api/students, falling back to JSON.");
    const allStudents = readStudents();
    return NextResponse.json({ success: true, data: allStudents, offline: true });
  }
}

// ─── POST: Create a student account ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password: customPassword } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const plainPassword =
      customPassword ||
      `Student@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 }
        );
      }

      const student = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          password: hashedPassword,
          role: "STUDENT",
          status: "ACTIVE",
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          password: plainPassword,
          role: "STUDENT",
          createdAt: student.createdAt,
        },
      });
    } catch (dbError) {
      console.warn("DB offline, saving student to JSON fallback.");
      const students = readStudents();

      if (students.find((s: any) => s.email === email)) {
        return NextResponse.json(
          { success: false, error: "Email already registered" },
          { status: 409 }
        );
      }

      const newStudent = {
        id: `student_${Date.now()}`,
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        plainPassword,
        role: "STUDENT",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        _count: { bookings: 0, reviews: 0 },
      };

      students.push(newStudent);
      writeStudents(students);

      return NextResponse.json({
        success: true,
        data: {
          id: newStudent.id,
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          password: plainPassword,
          role: "STUDENT",
          createdAt: newStudent.createdAt,
        },
        offline: true,
      });
    }
  } catch (error) {
    console.error("POST /api/students error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
