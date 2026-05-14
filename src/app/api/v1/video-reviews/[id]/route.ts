import { NextResponse } from "next/server";
import { VideoReviewService } from "@/services/video-review.service";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const review = await VideoReviewService.getById(params.id);
    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const review = await VideoReviewService.update(params.id, body);
    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await VideoReviewService.delete(params.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
