import { getCategoryBySlug } from "@/lib/catalog";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(
  async (req: Request, ...args: unknown[]) => {
    try {
      const context = args[0] as { params: Promise<{ slug: string }> };
      const { slug } = await context.params;
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "24", 10);

      const category = await getCategoryBySlug(slug, page, limit);

      if (!category) {
        throw new ApiError("Category not found", 404);
      }

      return successResponse("Category fetched successfully", category);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }
      throw new ApiError("An unknown error occurred", 500);
    }
  },
);
