import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/app/lib/jwt";

export const GET = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    return NextResponse.json({
      code: "SUCCESS",
      message: "authorized",
      data: {
        ...userData
      }
    }, {
      status: 200
    });
  }else{
    return NextResponse.json({
      code: "UNATHORIZED",
      message: "unauthorized"
    }, {
      status: 401
    });
  }
}