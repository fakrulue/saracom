import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const results = await prisma.$queryRawUnsafe('SELECT * FROM Theme ORDER BY updatedAt DESC LIMIT 1') as any[];
    
    if (!results || results.length === 0) {
      console.log("Theme API [GET]: No theme found in DB");
      return NextResponse.json({ data: null });
    }
    
    console.log("Theme API [GET]: Theme found via RAW SQL");
    return NextResponse.json({ data: JSON.parse(results[0].config) });
  } catch (error: any) {
    console.error("Theme API [GET] Error:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const configStr = JSON.stringify(body);
    console.log("Theme API [POST]: Received update request");
    
    const existing = await prisma.$queryRawUnsafe('SELECT id FROM Theme LIMIT 1') as any[];
    
    let result;
    if (existing && existing.length > 0) {
      const id = existing[0].id;
      await prisma.$executeRawUnsafe('UPDATE Theme SET config = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', configStr, id);
      console.log("Theme API [POST]: Updated via RAW SQL");
      result = { config: configStr };
    } else {
      const id = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await prisma.$executeRawUnsafe('INSERT INTO Theme (id, config, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)', id, configStr);
      console.log("Theme API [POST]: Created via RAW SQL");
      result = { config: configStr };
    }
    
    return NextResponse.json({ data: JSON.parse(result.config) });
  } catch (error: any) {
    console.error("Theme API [POST] Error:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}