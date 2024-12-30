import { NextRequest, NextResponse, userAgent } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";
import moment from "moment";

export const POST = async (req: NextRequest, { params }: {
  params: {
    outletId: string
  }
}) => {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if (accessToken && userData) {
    //register device
    const body = await req.json()
    const { outletId } = params

    const deviceCount = await prisma.device.count({
      where: {
        storeId: userData.storeId || 0,
        outletId: Number(outletId),
      }
    })

    const deviceData = await prisma.device.create({
      data: {
        storeId: userData.storeId || 0,
        outletId: Number(outletId),
        deviceId: body.uuid,
        deviceNumber: deviceCount + 1,
        manufacturer: body.manufacturer,
        brand: body.brand,
        deviceName: body.deviceName,
        deviceType: body.deviceType,
        modelId: body.modelId,
        osName: body.osName,
        osVersion: body.osVersion,
        platformApiLevel: body.platformApiLevel,
      }
    })

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: deviceData
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