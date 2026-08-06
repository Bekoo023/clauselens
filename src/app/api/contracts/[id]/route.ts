import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Owner-only permanent delete: the privacy policy promises contracts can be
// deleted from the dashboard "at any time". `deleteMany` scoped to
// `userId` doubles as the ownership check: another user's contract id
// simply matches zero rows instead of ever being touched.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const { count } = await prisma.contract.deleteMany({ where: { id, userId: session.user.id } });
  if (count === 0) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
