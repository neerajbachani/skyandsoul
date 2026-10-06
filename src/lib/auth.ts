import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { User, UserRole } from "@prisma/client";
import { ApiError } from "@/middleware/errorHandler";
import { prisma } from "@/lib/prisma";

export type JWTPayload = {
  userId: string;
  email: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role: UserRole;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">,
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JWTPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getUserFromRequest(
  request?: NextRequest,
): Promise<JWTPayload | null> {
  try {
    const token = request
      ? request.cookies.get("token")?.value
      : await getAuthCookie();

    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<JWTPayload> {
  const user = await getUserFromRequest(request);
  if (!user?.userId) {
    throw new Error("Authentication required");
  }
  return user;
}

export function publicUser(user: Pick<User, "id" | "email" | "name" | "phone" | "role" | "createdAt">) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowlistedAdmin(email: string): boolean {
  return adminEmails().includes(email.toLowerCase());
}

export async function requireUser(request?: NextRequest) {
  const auth = await getUserFromRequest(request);
  if (!auth?.userId) {
    throw new ApiError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) {
    throw new ApiError("Unauthorized", 401);
  }

  return user;
}

export async function requireAdmin(request?: NextRequest) {
  const user = await requireUser(request);
  if (user.role !== "ADMIN") {
    throw new ApiError("Forbidden", 403);
  }
  return user;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
