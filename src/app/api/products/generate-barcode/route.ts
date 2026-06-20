import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import moment from "moment";

export const GET = async (req: NextRequest) => {
  const productId = req.nextUrl.searchParams.get("productId") || 0;
  const today = moment().format("YYYYMMDD");

  const count = await prisma.barcode.count({
    where: {
      barcode: {
        startsWith: today,
      },
    },
  });

  const nextBarcode = today + ("000000000" + (count + 1)).slice(-4);

  await prisma.barcode.create({
    data: { productId: Number(productId), barcode: nextBarcode },
  });

  return NextResponse.json(nextBarcode);
};
