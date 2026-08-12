import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { listCategories } from "@/lib/catalog";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(async () => {
  try {
    const categories = await listCategories();
    return successResponse("Categories fetched successfully", categories);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    }
    throw new ApiError("An unknown error occurred", 500);
  }
});
