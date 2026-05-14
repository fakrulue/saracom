import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class VideoReviewService {
  static async getAll() {
    return await prisma.videoReview.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return await prisma.videoReview.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    videoUrl: string;
    thumbnailUrl?: string;
    reviewerName: string;
    reviewText?: string;
    rating: number;
    status?: string;
  }) {
    return await prisma.videoReview.create({
      data,
    });
  }

  static async update(id: string, data: any) {
    return await prisma.videoReview.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.videoReview.delete({
      where: { id },
    });
  }
}
