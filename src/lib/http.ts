import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "@/middleware/errorHandler";

export function jsonError(error: unknown, fallback = "Internal server error") {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid request data", details: error.flatten() },
      { status: 400 },
    );
  }
  if (error instanceof Error && error.message) {
    const client =
      error.message.startsWith("Cannot move an order") ||
      error.message.startsWith("A tracking number") ||
      error.message.startsWith("Record a refund") ||
      error.message.includes("already exists") ||
      error.message.includes("Unpublish");
    if (client) {
      const status = error.message.includes("Unpublish") || error.message.includes("already exists")
        ? 409
        : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
