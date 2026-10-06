import { NextRequest, NextResponse } from "next/server";
import { homeContentSchema } from "@/lib/admin-schemas";
import { requireAdmin } from "@/lib/auth";
import { readHomeContent, saveHomeContent } from "@/lib/home-content";
import { jsonError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const homepage = await readHomeContent();
    return NextResponse.json(homepage);
  } catch (error) {
    return jsonError(error, "Failed to load homepage");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const parsed = homeContentSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid homepage content" },
        { status: 400 },
      );
    }
    const content = await saveHomeContent(parsed.data);
    return NextResponse.json({ content, saved: true });
  } catch (error) {
    return jsonError(error, "Failed to save homepage");
  }
}
