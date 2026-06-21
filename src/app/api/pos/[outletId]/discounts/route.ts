import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { getFinalPrice, isEmptyVal } from "@/lib/functions";
import { verifyJwt } from "@/lib/jwt";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      outletId: string;
    };
  },
) => {
  const authorization = req.headers.get("authorization") || "";
  const [__, accessToken] = authorization.split(" ");

  const userData = verifyJwt(accessToken);

  if (accessToken && userData) {
    const { outletId } = params;

    const discounts = await prisma.discount.findManyAndCount({
      where: {
        outletId: Number(outletId),
        isActive: true,
      },
      orderBy: {
        discountValue: "asc",
      },
      select: {
        id: true,
        code: true,
        name: true,
        discountType: true,
        discountValue: true,
        maxAmount: true,
        minTransaction: true,
        isActive: true,
        recommendation: true,
      },
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: "",
      data: discounts,
    });
  } else {
    return NextResponse.json(
      {
        code: "UNATHORIZED",
        message: "Unathorized Error!",
      },
      {
        status: 401,
      },
    );
  }
};
