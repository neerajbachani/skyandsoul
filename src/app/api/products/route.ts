import { listProducts } from "@/lib/catalog";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const result = await listProducts({
      search,
      category,
      featured,
      page,
      limit,
    });

    return successResponse("Products fetched successfully", result);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    }
    throw new ApiError("An unknown error occurred", 500);
  }
});
