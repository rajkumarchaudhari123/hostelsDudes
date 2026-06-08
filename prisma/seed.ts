/**
 * Hostel Dudes – Prisma Seed Script
 * Run: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Hostel Dudes database...");

  // ─── Clean existing data ───────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.chatMessage.deleteMany(),
    prisma.chat.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.visitSchedule.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.inquiry.deleteMany(),
    prisma.review.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.foodMenu.deleteMany(),
    prisma.pGCollege.deleteMany(),
    prisma.room.deleteMany(),
    prisma.pG.deleteMany(),
    prisma.ownerAccount.deleteMany(),
    prisma.college.deleteMany(),
    prisma.city.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ─── Users ─────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const ownerPassword = await bcrypt.hash("Owner@123", 12);
  const studentPassword = await bcrypt.hash("Student@123", 12);

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@hostelsdudes.in",
      password: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: "Sunita Khanna",
      email: "owner@hostelsdudes.in",
      phone: "+91 98765 43210",
      password: ownerPassword,
      role: "PG_OWNER",
      status: "ACTIVE",
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Rajesh Mehta",
      email: "rajesh@hostelsdudes.in",
      phone: "+91 87654 32109",
      password: ownerPassword,
      role: "PG_OWNER",
      status: "ACTIVE",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Anjali Sharma",
      email: "student@hostelsdudes.in",
      phone: "+91 76543 21098",
      password: studentPassword,
      role: "STUDENT",
      status: "ACTIVE",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Rohan Patel",
      email: "rohan@example.com",
      phone: "+91 65432 10987",
      password: studentPassword,
      role: "STUDENT",
      status: "ACTIVE",
    },
  });

  console.log("✅ Users created");

  // ─── Owner Accounts ────────────────────────────────────────────────────────
  const ownerAccount1 = await prisma.ownerAccount.create({
    data: {
      userId: owner1.id,
      adminId: "SN-ABC123-XYZ",
      businessName: "Khanna PG Services",
      city: "Pune",
      status: "ACTIVE",
    },
  });

  const ownerAccount2 = await prisma.ownerAccount.create({
    data: {
      userId: owner2.id,
      adminId: "SN-DEF456-PQR",
      businessName: "Mehta Accommodations",
      city: "Bangalore",
      status: "ACTIVE",
    },
  });

  console.log("✅ Owner accounts created");

  // ─── Cities ────────────────────────────────────────────────────────────────
  const pune = await prisma.city.create({
    data: {
      name: "Pune",
      state: "Maharashtra",
      slug: "pune",
      pgCount: 2840,
      isPopular: true,
    },
  });

  const bangalore = await prisma.city.create({
    data: {
      name: "Bangalore",
      state: "Karnataka",
      slug: "bangalore",
      pgCount: 4120,
      isPopular: true,
    },
  });

  const mumbai = await prisma.city.create({
    data: {
      name: "Mumbai",
      state: "Maharashtra",
      slug: "mumbai",
      pgCount: 3560,
      isPopular: true,
    },
  });

  console.log("✅ Cities created");

  // ─── Colleges ──────────────────────────────────────────────────────────────
  const mitPune = await prisma.college.create({
    data: {
      name: "MIT College of Engineering",
      slug: "mit-pune",
      cityId: pune.id,
      address: "Ram Indu Park, Kothrud, Pune",
      latitude: 18.5074,
      longitude: 73.8077,
    },
  });

  const sympSIT = await prisma.college.create({
    data: {
      name: "Symbiosis Institute of Technology",
      slug: "sit-pune",
      cityId: pune.id,
      address: "Gram Lavale, Mulshi, Pune",
      latitude: 18.5204,
      longitude: 73.7878,
    },
  });

  const iimBangalore = await prisma.college.create({
    data: {
      name: "IIM Bangalore",
      slug: "iim-bangalore",
      cityId: bangalore.id,
      address: "Bannerghatta Road, Bangalore",
      latitude: 12.9203,
      longitude: 77.6021,
    },
  });

  console.log("✅ Colleges created");

  console.log("✅ Setup finished (no default PGs seeded)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
