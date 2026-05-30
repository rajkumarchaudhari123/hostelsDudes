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

  // ─── PGs ───────────────────────────────────────────────────────────────────
  const pg1 = await prisma.pG.create({
    data: {
      ownerId: ownerAccount1.id,
      cityId: pune.id,
      name: "Sunrise PG for Girls",
      slug: "sunrise-pg-girls-pune",
      description:
        "Premium girls-only PG near MIT College Kothrud. Fully furnished rooms with attached bathrooms, 24/7 security, home-cooked meals, and 100Mbps WiFi.",
      address: "14/B, Mayur Colony, Near MIT College, Kothrud, Pune – 411038",
      area: "Kothrud",
      latitude: 18.5074,
      longitude: 73.8077,
      gender: "FEMALE",
      status: "ACTIVE",
      featured: true,
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=60",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=60",
      ],
      coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=60",
      minRent: 7500,
      maxRent: 14000,
      deposit: 15000,
      noticePeriod: 30,
      curfewTime: "10:30 PM",
      totalRooms: 20,
      availableRooms: 3,
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      rating: 4.8,
      reviewCount: 2,
      hasWifi: true,
      hasAC: true,
      hasFood: true,
      hasLaundry: true,
      hasSecurity: true,
      hasPowerBackup: true,
      hasCCTV: true,
      hasAttachedBath: true,
      hasHotWater: true,
      hasTVRoom: true,
    },
  });

  const pg2 = await prisma.pG.create({
    data: {
      ownerId: ownerAccount1.id,
      cityId: pune.id,
      name: "Comfort Boys PG",
      slug: "comfort-boys-pg-shivajinagar",
      description:
        "Well-maintained boys PG in the heart of Shivajinagar, close to multiple colleges and IT parks. Budget-friendly with all essential amenities.",
      address: "7, FC Road, Near Fergusson College, Shivajinagar, Pune – 411005",
      area: "Shivajinagar",
      latitude: 18.5314,
      longitude: 73.8477,
      gender: "MALE",
      status: "ACTIVE",
      featured: false,
      verified: true,
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=60"],
      coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=60",
      minRent: 6000,
      maxRent: 9000,
      deposit: 10000,
      noticePeriod: 15,
      curfewTime: "11:00 PM",
      totalRooms: 15,
      availableRooms: 5,
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      rating: 4.5,
      reviewCount: 1,
      hasWifi: true,
      hasFood: true,
      hasParking: true,
      hasSecurity: true,
      hasPowerBackup: true,
    },
  });

  const pg3 = await prisma.pG.create({
    data: {
      ownerId: ownerAccount2.id,
      cityId: bangalore.id,
      name: "TechPark Co-ed PG",
      slug: "techpark-coed-pg-koramangala",
      description:
        "Modern co-ed PG in Koramangala, perfect for tech professionals and students. Fully furnished with premium amenities, high-speed internet, and a friendly community.",
      address: "45, 5th Block, Koramangala, Bangalore – 560095",
      area: "Koramangala",
      latitude: 12.9352,
      longitude: 77.6245,
      gender: "ANY",
      status: "ACTIVE",
      featured: true,
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=60",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=60",
      ],
      coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=60",
      minRent: 9000,
      maxRent: 16000,
      deposit: 18000,
      noticePeriod: 30,
      totalRooms: 30,
      availableRooms: 8,
      phone: "+91 87654 32109",
      whatsapp: "918765432109",
      rating: 4.6,
      reviewCount: 0,
      hasWifi: true,
      hasAC: true,
      hasFood: false,
      hasParking: true,
      hasLaundry: true,
      hasSecurity: true,
      hasPowerBackup: true,
      hasCCTV: true,
      hasGym: true,
      hasAttachedBath: true,
    },
  });

  console.log("✅ PGs created");

  // ─── Rooms ─────────────────────────────────────────────────────────────────
  await prisma.room.createMany({
    data: [
      { pgId: pg1.id, type: "SINGLE", rent: 14000, deposit: 15000, totalBeds: 1, availBeds: 1, floor: 2, description: "Spacious single room with attached bathroom, AC, and balcony" },
      { pgId: pg1.id, type: "DOUBLE", rent: 9000, deposit: 12000, totalBeds: 2, availBeds: 2, floor: 1, description: "Comfortable double sharing room" },
      { pgId: pg1.id, type: "TRIPLE", rent: 7500, deposit: 10000, totalBeds: 3, availBeds: 0, floor: 1, description: "Budget-friendly triple sharing" },
      { pgId: pg2.id, type: "SINGLE", rent: 9000, deposit: 10000, totalBeds: 1, availBeds: 2, floor: 1 },
      { pgId: pg2.id, type: "DOUBLE", rent: 7000, deposit: 8000, totalBeds: 2, availBeds: 3, floor: 2 },
      { pgId: pg3.id, type: "SINGLE", rent: 16000, deposit: 18000, totalBeds: 1, availBeds: 3, floor: 3 },
      { pgId: pg3.id, type: "DOUBLE", rent: 12000, deposit: 14000, totalBeds: 2, availBeds: 5, floor: 2 },
    ],
  });

  console.log("✅ Rooms created");

  // ─── PG–College relationships ──────────────────────────────────────────────
  await prisma.pGCollege.createMany({
    data: [
      { pgId: pg1.id, collegeId: mitPune.id, distance: 0.5, travelTime: 7 },
      { pgId: pg1.id, collegeId: sympSIT.id, distance: 2.8, travelTime: 20 },
      { pgId: pg2.id, collegeId: mitPune.id, distance: 1.8, travelTime: 15 },
      { pgId: pg3.id, collegeId: iimBangalore.id, distance: 3.2, travelTime: 18 },
    ],
  });

  // ─── Food Menu ─────────────────────────────────────────────────────────────
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  await prisma.foodMenu.createMany({
    data: days.map((day) => ({
      pgId: pg1.id,
      day,
      breakfast: "Idli / Poha / Upma + Tea",
      lunch: "Dal, Rice, 2 Sabzi, Roti, Salad, Papad",
      dinner: "Chapati, Dal, Rice, Sabzi, Curd",
      snacks: "Biscuits + Tea / Coffee",
    })),
  });

  console.log("✅ Food menu created");

  // ─── Reviews ───────────────────────────────────────────────────────────────
  await prisma.review.create({
    data: {
      userId: student1.id,
      pgId: pg1.id,
      rating: 5,
      comment:
        "Absolutely love this PG! The food is amazing, cleanliness is top-notch, and the owner is super caring. Best PG in Kothrud without a doubt!",
      isVerified: true,
      helpful: 12,
    },
  });

  await prisma.review.create({
    data: {
      userId: student2.id,
      pgId: pg1.id,
      rating: 5,
      comment:
        "WiFi is super fast, rooms are well-maintained. Location is perfect – just 5 min walk to MIT College. Highly recommended for girls!",
      isVerified: true,
      helpful: 8,
    },
  });

  await prisma.review.create({
    data: {
      userId: student1.id,
      pgId: pg2.id,
      rating: 4,
      comment: "Good PG for boys. Food is decent, rooms are spacious. Owner is very responsive. Great value for money.",
      isVerified: false,
      helpful: 5,
    },
  });

  console.log("✅ Reviews created");

  // ─── Bookings ──────────────────────────────────────────────────────────────
  await prisma.booking.create({
    data: {
      userId: student1.id,
      pgId: pg1.id,
      checkInDate: new Date("2026-06-01"),
      rent: 12000,
      deposit: 15000,
      totalAmount: 27000,
      status: "CONFIRMED",
      notes: "Looking forward to moving in!",
    },
  });

  await prisma.booking.create({
    data: {
      userId: student2.id,
      pgId: pg2.id,
      checkInDate: new Date("2026-06-05"),
      rent: 9000,
      deposit: 10000,
      totalAmount: 19000,
      status: "PENDING",
    },
  });

  console.log("✅ Bookings created");

  // ─── Inquiries ─────────────────────────────────────────────────────────────
  await prisma.inquiry.create({
    data: {
      userId: student1.id,
      pgId: pg1.id,
      message: "Hi, I'm interested in a single room from June 1st. Is the AC room available?",
      status: "RESPONDED",
      response: "Yes, we have 1 AC single room available from June 1st. Rent is ₹14,000/month. Please schedule a visit!",
    },
  });

  console.log("✅ Inquiries created");

  // ─── Favorites ─────────────────────────────────────────────────────────────
  await prisma.favorite.createMany({
    data: [
      { userId: student1.id, pgId: pg1.id },
      { userId: student1.id, pgId: pg3.id },
      { userId: student2.id, pgId: pg2.id },
    ],
  });

  console.log("✅ Favorites created");

  // ─── Notifications ─────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        type: "BOOKING",
        title: "Booking Confirmed! 🎉",
        message: "Your booking at Sunrise PG for Girls has been confirmed for June 1st.",
        link: "/dashboard/bookings",
        read: false,
      },
      {
        userId: owner1.id,
        type: "BOOKING",
        title: "New Booking Request",
        message: "Anjali Sharma has sent a booking request for a single room.",
        link: "/owner/bookings",
        read: false,
      },
    ],
  });

  console.log("✅ Notifications created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Super Admin: admin@hostelsdudes.in / Admin@123");
  console.log("PG Owner:    owner@hostelsdudes.in / Owner@123");
  console.log("Student:     student@hostelsdudes.in / Student@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
