import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../client";

export const PUT = async (request: Request, {params}: {params: {
  roleId: string,
}}) =>  {
  const body = await request.json()
  const {roleId} = params

  const role = await prisma.role.update({
    where: {
      id: Number(roleId)
    },
    data: {
      name: body.name,
      storeId: 1,
      roles: body.roles,
      isActive: true,
      updateBy: 'user'
    }
  })

  return NextResponse.json(role);
}
