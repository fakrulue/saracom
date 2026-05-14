import { NextResponse } from "next/server";
import { VideoReviewService } from "@/services/video-review.service";

export async function GET() {
  try {
    const reviews = await VideoReviewService.getAll();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const review = await VideoReviewService.create(body);
    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
