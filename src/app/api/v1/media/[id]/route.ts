import { NextRequest, NextResponse } from "next/server";
import { unlink, readFile } from "fs/promises";
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
  const data = await readFile(MANIFEST_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeManifest(entries: ManifestEntry[]) {
  await writeFile(MANIFEST_PATH, JSON.stringify(entries, null, 2));
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const manifest = await readManifest();
    const entry = manifest.find(m => m.id === id);
    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const filepath = path.join(UPLOAD_DIR, entry.filename);
    try {
      await unlink(filepath);
    } catch {}

    const updated = manifest.filter(m => m.id !== id);
    await writeManifest(updated);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error?.message || "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, alt } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const manifest = await readManifest();
    const idx = manifest.findIndex(m => m.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    manifest[idx].alt = alt ?? manifest[idx].alt;
    await writeManifest(manifest);

    return NextResponse.json({ media: manifest[idx] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Update failed" }, { status: 500 });
  }
}