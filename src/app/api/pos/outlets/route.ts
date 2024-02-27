import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../client";
import { verifyJwt } from "@/app/lib/jwt";

export const GET = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const userOulets = await prisma.userOutlet.findMany({
      where: {
       userId: userData.id,
       isActive: true
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        outlet: {
          select: {
            id: true,
            name: true,
            sequence: true,
            storeId: true,
            printExtraInfo: true,
            printHeaderLogo: true,
            printHeaderLine1: true,
            printHeaderLine2: true,
            printHeaderLine3: true,
            printHeaderLine4: true,
            printHeaderLine5: true,
            phone: true,
            address: true,
            isActive: true
          }
        }
      }
    })

    const outlets = userOulets.map((userOulet) => {
     return {...userOulet.outlet}
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: outlets
    });

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "unathorized"
    }, {
      status: 401
    });
  }
}