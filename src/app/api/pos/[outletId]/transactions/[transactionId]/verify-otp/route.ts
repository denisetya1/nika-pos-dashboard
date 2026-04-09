import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      transactionId: string;
    };
  },
) => {
  const authorization = req.headers.get("authorization") || "";
  const [__, accessToken] = authorization.split(" ");

  const userData = verifyJwt(accessToken);

  if (accessToken && userData) {
    const body = await req.json();

    const { transactionId } = params;

    const { code } = body;

    const editAuthorized = await prisma.requestEditTransaction.findFirst({
      where: {
        transactionId,
        code,
      },
    });

    if (editAuthorized) {
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
        },
        include: {
          transactionDetails: true,
        },
      });

      return NextResponse.json({
        code: "SUCCESS",
        message: "",
        data: transaction,
      });
    } else {
      return NextResponse.json(
        {
          code: "DATA_NOT_EXISTS",
          message: "OTP tidak valid!",
          data: null,
        },
        {
          status: 404,
        },
      );
    }
  } else {
    return NextResponse.json(
      {
        code: "UNATHORIZED",
        message: "Unathorized Error!",
        data: null,
      },
      {
        status: 401,
      },
    );
  }
};
