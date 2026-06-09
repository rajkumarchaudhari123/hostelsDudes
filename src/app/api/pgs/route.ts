import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types";
import { getCustomPGs, addCustomPG } from "@/utils/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 48);
    const skip = (page - 1) * limit;

    // Filters
    const city = searchParams.get("city");
    const area = searchParams.get("area");
    const gender = searchParams.get("gender");
    const minRent = searchParams.get("minRent");
    const maxRent = searchParams.get("maxRent");
    const ownerId = searchParams.get("ownerId"); // Filter for specific owner's dashboard listings

    const hasWifi = searchParams.get("hasWifi");
    const hasAC = searchParams.get("hasAC");
    const hasFood = searchParams.get("hasFood");
    const hasParking = searchParams.get("hasParking");
    const hasLaundry = searchParams.get("hasLaundry");
    const hasSecurity = searchParams.get("hasSecurity");
    const hasPowerBackup = searchParams.get("hasPowerBackup");
    const hasAttachedBath = searchParams.get("hasAttachedBath");

    const where: Record<string, any> = { status: "ACTIVE" };

    if (city) {
      where.city = { slug: { contains: city, mode: "insensitive" } };
    }
    if (area) {
      where.area = { contains: area, mode: "insensitive" };
    }
    if (gender && gender !== "ANY") {
      where.gender = gender;
    }
    if (minRent || maxRent) {
      where.minRent = {};
      if (minRent) (where.minRent as Record<string, number>).gte = parseInt(minRent);
      if (maxRent) (where.maxRent as Record<string, number>).lte = parseInt(maxRent);
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }

    // Boolean filters
    if (hasWifi === "true") where.hasWifi = true;
    if (hasAC === "true") where.hasAC = true;
    if (hasFood === "true") where.hasFood = true;
    if (hasParking === "true") where.hasParking = true;
    if (hasLaundry === "true") where.hasLaundry = true;
    if (hasSecurity === "true") where.hasSecurity = true;
    if (hasPowerBackup === "true") where.hasPowerBackup = true;
    if (hasAttachedBath === "true") where.hasAttachedBath = true;

    let dbPgs: any[] = [];
    let total = 0;

    try {
      const dbWhere = { ...where };
      if (ownerId) {
        // If ownerId is provided, we query draft listings too
        delete dbWhere.status;
      }
      
      [dbPgs, total] = await Promise.all([
        prisma.pG.findMany({
          where: dbWhere,
          orderBy: { rating: "desc" },
          skip,
          take: limit,
          include: { city: { select: { name: true, slug: true } } }
        }),
        prisma.pG.count({ where: dbWhere }),
      ]);
    } catch (dbError) {
      console.warn("Database offline during GET /api/pgs, falling back to JSON storage only.");
    }

    // Load custom JSON PGs
    const customPgs = getCustomPGs();

    // Map custom PGs to fit our API format
    const mappedCustomPgs = customPgs.map(pg => {
      const isNoida = pg.cityId === "noida";
      return {
        ...pg,
        city: isNoida
          ? { name: "Noida", slug: "noida" }
          : { name: "Greater Noida", slug: "greater-noida" }
      };
    });

    // Merge databases
    let mergedPgs = [...mappedCustomPgs, ...dbPgs];

    // Apply filtering in JavaScript for JSON fallbacks
    if (ownerId) {
      mergedPgs = mergedPgs.filter(pg => pg.ownerId.toLowerCase() === ownerId.toLowerCase());
    }
    if (gender && gender !== "ANY") {
      mergedPgs = mergedPgs.filter(pg => pg.gender === gender);
    }
    if (area) {
      mergedPgs = mergedPgs.filter(pg => pg.area.toLowerCase().includes(area.toLowerCase()));
    }
    if (minRent) {
      mergedPgs = mergedPgs.filter(pg => pg.minRent >= parseInt(minRent));
    }
    if (maxRent) {
      mergedPgs = mergedPgs.filter(pg => pg.minRent <= parseInt(maxRent));
    }
    if (hasWifi === "true") mergedPgs = mergedPgs.filter(pg => pg.hasWifi);
    if (hasAC === "true") mergedPgs = mergedPgs.filter(pg => pg.hasAC);
    if (hasFood === "true") mergedPgs = mergedPgs.filter(pg => pg.hasFood);
    if (hasParking === "true") mergedPgs = mergedPgs.filter(pg => pg.hasParking);
    if (hasLaundry === "true") mergedPgs = mergedPgs.filter(pg => pg.hasLaundry);
    if (hasSecurity === "true") mergedPgs = mergedPgs.filter(pg => pg.hasSecurity);
    if (hasPowerBackup === "true") mergedPgs = mergedPgs.filter(pg => pg.hasPowerBackup);
    if (hasAttachedBath === "true") mergedPgs = mergedPgs.filter(pg => pg.hasAttachedBath);

    const paginatedPgs = mergedPgs.slice(skip, skip + limit);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: paginatedPgs,
      pagination: {
        total: mergedPgs.length,
        page,
        limit,
        totalPages: Math.ceil(mergedPgs.length / limit),
      },
    });
  } catch (error) {
    console.error("[PG_LIST]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch PGs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ["name", "description", "address", "area", "minRent", "maxRent", "gender"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const slug = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${body.area.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    // Map body inputs to local JSON model
    const newCustomPg = {
      id: `pg-${Date.now()}`,
      ownerId: body.ownerId || "demo-owner",
      cityId: body.cityId || "clpune123", // default fallback city id
      name: body.name,
      slug,
      description: body.description,
      address: body.address,
      area: body.area,
      latitude: body.latitude ? parseFloat(body.latitude) : 18.5204,
      longitude: body.longitude ? parseFloat(body.longitude) : 73.8567,
      gender: body.gender || "ANY",
      status: "ACTIVE" as const, // Activate directly for immediate verification in demo mode
      featured: body.featured || false,
      verified: true,
      images: body.images || ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60"],
      coverImage: body.coverImage || (body.images && body.images[0]) || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60",
      minRent: parseInt(body.minRent),
      maxRent: parseInt(body.maxRent),
      deposit: body.deposit ? parseInt(body.deposit) : 0,
      noticePeriod: body.noticePeriod ? parseInt(body.noticePeriod) : 30,
      curfewTime: body.curfewTime || "None",
      totalRooms: body.totalRooms ? parseInt(body.totalRooms) : 10,
      availableRooms: body.availableRooms ? parseInt(body.availableRooms) : 5,
      rating: 0,
      reviewCount: 0,
      phone: body.phone || "+91 99999 99999",
      whatsapp: body.whatsapp || "+91 99999 99999",
      hasWifi: !!body.hasWifi,
      hasAC: !!body.hasAC,
      hasFood: !!body.hasFood,
      hasParking: !!body.hasParking,
      hasLaundry: !!body.hasLaundry,
      hasSecurity: !!body.hasSecurity,
      hasPowerBackup: !!body.hasPowerBackup,
      hasCCTV: !!body.hasCCTV,
      hasGym: !!body.hasGym,
      hasAttachedBath: !!body.hasAttachedBath,
      hasHotWater: !!body.hasHotWater,
      hasTVRoom: !!body.hasTVRoom,
    };

    // 1. Always save to JSON store
    addCustomPG(newCustomPg);

    // 2. Attempt to save to real postgres database (wrapped in try/catch)
    let dbSuccess = false;
    let pgId = newCustomPg.id;

    try {
      // Find a city to link to
      let city = await prisma.city.findFirst();
      if (!city) {
        city = await prisma.city.create({
          data: { name: "Pune", slug: "pune", state: "Maharashtra" }
        });
      }
      
      // Find owner account or create mock owner profile for DB
      let owner = await prisma.ownerAccount.findFirst();
      if (!owner) {
        const adminUser = await prisma.user.findFirst({ where: { email: "owner@hostelsdudes.in" } });
        if (adminUser) {
          owner = await prisma.ownerAccount.create({
            data: { userId: adminUser.id, adminId: "SN-DEMO-OWNER", businessName: "Demo Business" }
          });
        }
      }

      if (city && owner) {
        const dbPg = await prisma.pG.create({
          data: {
            ownerId: owner.id,
            cityId: city.id,
            name: body.name,
            slug,
            description: body.description,
            address: body.address,
            area: body.area,
            latitude: body.latitude ? parseFloat(body.latitude) : 18.5204,
            longitude: body.longitude ? parseFloat(body.longitude) : 73.8567,
            gender: body.gender || "ANY",
            status: "ACTIVE",
            minRent: parseInt(body.minRent),
            maxRent: parseInt(body.maxRent),
            deposit: body.deposit ? parseInt(body.deposit) : 0,
            noticePeriod: body.noticePeriod ? parseInt(body.noticePeriod) : 30,
            curfewTime: body.curfewTime || "None",
            totalRooms: body.totalRooms ? parseInt(body.totalRooms) : 10,
            availableRooms: body.availableRooms ? parseInt(body.availableRooms) : 5,
            images: body.images || ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60"],
            coverImage: body.coverImage || (body.images && body.images[0]) || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=60",
            phone: body.phone || "+91 99999 99999",
            whatsapp: body.whatsapp || "+91 99999 99999",
            hasWifi: !!body.hasWifi,
            hasAC: !!body.hasAC,
            hasFood: !!body.hasFood,
            hasParking: !!body.hasParking,
            hasLaundry: !!body.hasLaundry,
            hasSecurity: !!body.hasSecurity,
            hasPowerBackup: !!body.hasPowerBackup,
            hasCCTV: !!body.hasCCTV,
            hasGym: !!body.hasGym,
            hasAttachedBath: !!body.hasAttachedBath,
            hasHotWater: !!body.hasHotWater,
            hasTVRoom: !!body.hasTVRoom,
          },
        });
        pgId = dbPg.id;
        dbSuccess = true;
      }
    } catch (dbError) {
      console.warn("Database connection offline during PG listing POST, saved locally to JSON file.");
    }

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        data: { ...newCustomPg, id: pgId }, 
        message: dbSuccess 
          ? "PG listing created in database and local JSON cache successfully"
          : "PG listing created in local JSON fallback store successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PG_CREATE]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create PG listing" },
      { status: 500 }
    );
  }
}
