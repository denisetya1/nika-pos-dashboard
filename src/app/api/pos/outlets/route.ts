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
            isActive: true
          }
        }
      }
    })

    const outlets = userOulets.map((userOulet) => {
     return {...userOulet.outlet}
    })

    return NextResponse.json(outlets);

  } else {
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "unathorized"
    }, {
      status: 401
    });
  }
}