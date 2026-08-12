import { getProductBySlug } from "@/lib/catalog";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(
  async (_req: Request, ...args: unknown[]) => {
    try {
      const context = args[0] as { params: Promise<{ slug: string }> };
      const { slug } = await context.params;
      const product = await getProductBySlug(slug);

      if (!product) {
        throw new ApiError("Product not found", 404);
      }

      return successResponse("Product fetched successfully", product);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }
      throw new ApiError("An unknown error occurred", 500);
    }
  },
);
