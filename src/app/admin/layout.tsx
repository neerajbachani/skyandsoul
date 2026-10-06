import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthCookie();
  if (!token) redirect("/auth/login?redirect=/admin");

  let userId = "";
  try {
    userId = verifyToken(token).userId;
  } catch {
    redirect("/auth/login?redirect=/admin");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") redirect("/");

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
