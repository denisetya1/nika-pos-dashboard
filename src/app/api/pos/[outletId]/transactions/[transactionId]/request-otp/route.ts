import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";
import sendMail from "@/lib/sendMail";

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
    const { transactionId } = params;

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (transaction) {
      const code = Math.random().toString().substring(2, 8);

      const request = await prisma.requestEditTransaction.create({
        data: {
          transactionId,
          code,
        },
      });

      const htmlContent = `<p>${userData.name} meminta untuk mengubah transaksi <strong>${transaction.id}</strong>.</p>
      <p>berikut Kode OTP untuk melakukan perubahan:<br /><br /><br /></p>
      <p style="text-align: center"><strong style="font-size: 45px">${code}</strong><br /><br /><br /></p>`;

      // await sendMail({
      //   sender: {
      //     'name': 'No-Reply',
      //     'email': 'no-reply@mailer.beautycat.id',
      //   },
      //   to: [{
      //     name: 'Deni',
      //     email: 'deni.setyawan@gmail.com'
      //   }],
      //   subject: `Permintaan Edit Transaksi: ${transaction.id}`,
      //   htmlContent
      // })

      if (request) {
        return NextResponse.json({
          code: "SUCCESS",
          message: "",
          data: request,
        });
      } else {
        return NextResponse.json(
          {
            code: "ERROR",
            message: "Gagal menyimpan data!",
            data: null,
          },
          {
            status: 400,
          },
        );
      }
    } else {
      return NextResponse.json(
        {
          code: "DATA_NOT_EXISTS",
          message: "Data tidak ditemukan!",
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
