import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MANIFEST_PATH = path.join(UPLOAD_DIR, "manifest.json");

type ManifestEntry = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  createdAt: string;
};

async function readManifest(): Promise<ManifestEntry[]> {
  if (!existsSync(MANIFEST_PATH)) return [];
  try {
    const data = await readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeManifest(entries: ManifestEntry[]) {
  await writeFile(MANIFEST_PATH, JSON.stringify(entries, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const alt = formData.get("alt") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `/uploads/${filename}`;
    const id = `media_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const entry: ManifestEntry = {
      id,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      alt: alt || null,
      createdAt: new Date().toISOString(),
    };

    const manifest = await readManifest();
    manifest.unshift(entry);
    await writeManifest(manifest);

    return NextResponse.json({ media: entry }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").toLowerCase();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");

    const all = await readManifest();
    const filtered = search
      ? all.filter(m => m.originalName.toLowerCase().includes(search))
      : all;

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const media = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      media,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("List error:", error);
    return NextResponse.json({ error: error?.message || "Failed to list media" }, { status: 500 });
  }
}