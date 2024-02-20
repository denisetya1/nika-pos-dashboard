import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "../../../client";
import { signJwtAccessToken } from "@/app/lib/jwt";

export const GET = async (request: Request) =>  {
  const salt = bcrypt.genSaltSync()

  // const user = await prisma.user.create({
  //   data: {
  //     username: "deni.setyawan@gmail.com",
  //     password: await bcrypt.hash("werkudoro", salt),
  //     emailVerified: new Date(),
  //     name: "Deni",
  //     phone: "123123123",
  //     isSubAccount: false,
  //     isActive: true,
  //   }
  // })

  // return NextResponse.json(user)
}

export const POST = async (request: Request) =>  {
  const body = await request.json()
  const { username, password, deviceInfo } = body
 
  let user = await prisma.user.findFirst({
    where: {
      username
    }
  })

  if(user && (await bcrypt.compare(password, user.password))) {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date()
      }
    })

    const { password , ...userWithoutPass } = user
    const accessToken = signJwtAccessToken(userWithoutPass)

    if(user.storeId === null && user.isSubAccount !== true){
      const store = await prisma.store.findFirst({
        where: {
          userId: user.id
        }
      })

      if(store){
        user.storeId = store.id
      }
    }

    let deviceData = null

    if(deviceInfo && deviceInfo.uuid === null){
      const deviceCount = await prisma.device.count({
        where: {
          storeId: user.storeId || 0
        }
      })

      deviceData = await prisma.device.create({
        data: {
          storeId: user.storeId || 0,
          deviceId: deviceInfo.uuid,
          deviceNumber: deviceCount+1,
          manufacturer: deviceInfo.manufacturer,
          brand: deviceInfo.brand,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType,
          modelId: deviceInfo.modelId,
          osName: deviceInfo.osName,
          osVersion: deviceInfo.osVersion,
          platformApiLevel: deviceInfo.platformApiLevel,
        }
      })
    }

    return NextResponse.json({ 
      code: 'SUCCESS',
      message: '',
      data:{
        ...userWithoutPass, 
        accessToken,
        deviceInfo: deviceData || undefined
      }
    })
  } else {
    return NextResponse.json({
      code: 'DATA_NOT_EXISTS',
      message: 'User tidak ditemukan!'
    }, {
      status: 404,
    });
  }
}
