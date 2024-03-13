import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { getSessionData } from "@/actions/Sessions";

export const GET = async () =>  {
  const session = await getSessionData();

  const userOutlets = await prisma.userOutlet.findMany({
    where: {
      userId: session?.user.id,
      isActive: true
    },
    select: {
      userId: true,
      roleId: true,
      role: {
        select: {
          id: true,
          name: true,
          roles: true
        }
      },
      outlet: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return NextResponse.json(userOutlets);
}