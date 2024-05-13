import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export const GET = async (req: NextRequest) =>  {
  const authorization = req.headers.get('authorization') || ''
  const [__, accessToken] = authorization.split(' ')

  const userData = verifyJwt(accessToken)

  if(accessToken && userData) {
    const object = {
      marketPlaces: ['Shopee', 'Tokopedia', 'BliBli', 'Lazada', 'TikTok'],
      couriers: [
        'LEX',
        'SPX',
        'Ninja',
        'AnterAja',
        'J&T',
        'Sicepat',
        'JNE',
        'SPX-Instant',
        'GRAB',
        'GOSEND',
      ],
    }

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: object
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