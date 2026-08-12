import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/utils/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.count();
    return successResponse("Database connected", { ok: true, categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed";
    return errorResponse(message, 503);
  }
}
