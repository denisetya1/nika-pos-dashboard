import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

export const GET = async (req: NextRequest, { params }: {
  params: {
    outletId: string
  }
}) => {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if (accessToken && userData) {
    const { outletId } = params;

    let outlet = await prisma.outlet.findUnique({
      where: {
        id: Number(outletId),
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sequence: true,
        isActive: true,
        address: true,
        phone: true,
        printHeaderLogo: true,
        printHeaderLine1: true,
        printHeaderLine2: true,
        printHeaderLine3: true,
        printHeaderLine4: true,
        printHeaderLine5: true,
        printExtraInfo: true,
        storeId: true,
        isActivePOS: true,
      }
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: outlet
    });

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "Unathorized Error!"
    }, {
      status: 401
    });
  }
}