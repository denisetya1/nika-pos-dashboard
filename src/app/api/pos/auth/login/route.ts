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
  const { username, password } = body
 
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

    return NextResponse.json({ 
      code: 'SUCCESS',
      message: '',
      data:{
        ...userWithoutPass, 
        accessToken 
      }
    })
  } else {
    return NextResponse.json({
      code: 'DATA_NOT_EXISTS',
      message: 'User tidak ditemukan!'
    }, {
      status: 401,
    });
  }
}
