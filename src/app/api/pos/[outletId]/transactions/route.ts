import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyJwt } from "@/lib/jwt";

export const POST = async (req: NextRequest) => {
  const authorization = req.headers.get("authorization") || "";
  const [__, accessToken] = authorization.split(" ");

  const userData = verifyJwt(accessToken);

  if (!accessToken || !userData) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "Unauthorized Error!", data: null },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();

    // 1. FILTER UNTUK TEST PRODUCT
    const testProduct = body.transactionDetails.filter((p: any) =>
      p.name.toLowerCase().includes("test product"),
    );

    if (testProduct.length > 0) {
      await prisma.testTransaction.create({
        data: {
          transactionId: body.id,
          data: JSON.stringify(body),
        },
      });
      return NextResponse.json({
        code: "SUCCESS",
        message: "Test transaction saved.",
        data: body,
      });
    }

    // 2. CHECK RESI FOR MARKETPLACE (Pre-check di luar transaksi untuk menghemat resource)
    const paymentMethod = await prisma.outletPaymentMethod.findUnique({
      where: { id: Number(body.outletPaymentMethodId) },
    });

    let marketplaceId = null;
    let courierId = null;
    let marketplaceReffId = null;
    let trackingNumber = null;

    if (paymentMethod && paymentMethod.paymentMethodId === 4) {
      const map = ["Shopee", "Tokopedia", "BliBli", "Lazada", "TikTok"];

      const cr = [
        "LEX",
        "SPX",
        "Ninja",
        "AnterAja",
        "J&T",
        "SAPX",
        "Sicepat",
        "JNE",
        "SPX-Instant",
        "GRAB",
        "GOSEND",
      ];

      const marketplaces = body.cardNumber.split("/");
      const couriers = body.confirmNumber.split("/");

      if (marketplaces?.[0]) {
        marketplaceId =
          map.indexOf(marketplaces[0].trim()) > -1
            ? map.indexOf(marketplaces[0].trim()) + 1
            : null;
      }
      if (marketplaces?.[1]) {
        marketplaceReffId = marketplaces?.[1].trim();
      }
      if (couriers?.[0]) {
        courierId =
          cr.indexOf(couriers[0].trim()) > -1
            ? cr.indexOf(couriers[0].trim()) + 1
            : null;
      }
      if (couriers?.[1]) {
        trackingNumber = couriers[1].trim();
      }

      const checkResi = await prisma.transaction.findFirst({
        where: { trackingNumber: trackingNumber },
      });

      if (checkResi) {
        return NextResponse.json(
          {
            code: "DATA_IS_EXISTS",
            message: "Nomor Resi sudah ada!",
            data: body,
          },
          { status: 400 },
        );
      }
    }

    // ===================================================
    // 3. JALANKAN PRISMA $TRANSACTION (SAFE & ACID)
    // ===================================================
    const finalTransaction = await prisma.$transaction(async (tx) => {
      // A. Amankan Double Submit (Pindahkan check ID ke dalam transaksi agar terkena DB lock)
      const checkTransactionInner = await tx.transaction.findUnique({
        where: { id: body.id },
      });

      if (checkTransactionInner) {
        throw new Error("TRANSACTION_ALREADY_EXISTS");
      }

      // B. Validasi Stok Terlebih Dahulu Sebelum Dikurangi
      for (const item of body.transactionDetails) {
        const currentStock = await tx.productStock.findUnique({
          where: { id: item.productStockId },
        });

        if (!currentStock) {
          throw new Error(`PRODUCT_STOCK_NOT_FOUND:${item.name}`);
        }

        if (currentStock.quantity < Number(item.qty)) {
          throw new Error(`INSUFFICIENT_STOCK:${item.name}`);
        }
      }

      // C. Sanitasi & Mapping Data Details (Pastikan tipe data angka valid)
      const sanitizedDetails = body.transactionDetails.map((dt: any) => {
        const {
          productId,
          categoryId,
          brandId,
          qty,
          sellPrice,
          discountPercentage,
          markupPercentage,
          discountAmount,
          finalSellPrice,
          total,
          totalDiscount,
          ...rest
        } = dt;

        return {
          productStockId: dt.productStockId,
          productId: Number(productId),
          categoryId: Number(categoryId),
          brandId: Number(brandId),
          qty: Number(qty),
          sellPrice: Number(sellPrice),
          discountPercentage: Number(discountPercentage),
          markupPercentage: Number(markupPercentage),
          discountAmount: Number(discountAmount),
          finalSellPrice: Number(finalSellPrice),
          total: Number(total),
          totalDiscount: Number(totalDiscount),
          ...rest,
        };
      });

      // D. Buat Transaksi Utama
      const transaction = await tx.transaction.create({
        data: {
          id: body.id,
          storeId: body.storeId,
          cardNumber: body.cardNumber,
          confirmNumber: body.confirmNumber,
          transactionTime: body.transactionTime,
          totalItem: Number(body.totalItem),
          totalPrice: Number(body.totalPrice),
          subTotal: Number(body.subTotal),
          totalDiscount: Number(body.totalDiscount),
          amountPaid: Number(body.amountPaid),
          amountChange: Number(body.amountChange),
          outlet: { connect: { id: body.outletId } },
          user: { connect: { id: body.userId } },
          userShift: { connect: { id: body.userShiftId } },
          outletPaymentMethod: { connect: { id: body.outletPaymentMethodId } },
          marketplaceReffId: marketplaceReffId,
          trackingNumber: trackingNumber,
          marketplace: marketplaceId
            ? { connect: { id: Number(marketplaceId) } }
            : undefined,

          courier: courierId
            ? { connect: { id: Number(courierId) } }
            : undefined,
          transactionDetails: {
            createMany: { data: sanitizedDetails },
          },
        },
        include: { transactionDetails: true },
      });

      // E. Simpan Diskon Transaksi (Jika ada)
      if (body.discountData) {
        const {
          id,
          maxAmount,
          minTransaction,
          discountValue,
          ...discountData
        } = body.discountData;
        await tx.transactionDiscount.create({
          data: {
            transactionId: transaction.id,
            discountId: Number(id),
            maxAmount: Number(maxAmount),
            minTransaction: Number(minTransaction),
            discountValue: Number(discountValue),
            ...discountData,
          },
        });
      }

      // F. Kurangi Stok Produk (Sudah tervalidasi dengan aman di atas)
      const stockUpdates = transaction.transactionDetails.map((product) => {
        return tx.productStock.update({
          where: { id: product.productStockId },
          data: {
            quantity: { decrement: product.qty }, // 'decrement' otomatis mengurangi nilai di DB
          },
        });
      });

      await Promise.all(stockUpdates);

      return transaction;
    });

    // Jika semua proses di dalam transaksi sukses tanpa throws/error
    return NextResponse.json({
      code: "SUCCESS",
      message: "Transaksi berhasil disimpan.",
      data: finalTransaction,
    });
  } catch (error: any) {
    console.error(
      "⚠️ Transaction Failed. Rollbacked! Error log:",
      error.message,
    );

    // Custom Error Handler berdasarkan flag string error yang kita buat di atas
    if (error.message === "TRANSACTION_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          code: "DATA_IS_EXISTS",
          message: "Nomor transaksi sudah ada!",
          data: null,
        },
        { status: 400 },
      );
    }

    if (error.message.startsWith("INSUFFICIENT_STOCK")) {
      const productName = error.message.split(":")[1];
      return NextResponse.json(
        {
          code: "STOCK_NOT_ENOUGH",
          message: `Stok produk '${productName}' tidak mencukupi!`,
          data: null,
        },
        { status: 400 },
      );
    }

    if (error.message.startsWith("PRODUCT_STOCK_NOT_FOUND")) {
      const productName = error.message.split(":")[1];
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          message: `Data stok untuk produk '${productName}' tidak ditemukan!`,
          data: null,
        },
        { status: 400 },
      );
    }

    // Default Error Database / Prisma Constraint
    return NextResponse.json(
      {
        code: "ERROR",
        message: "Gagal memproses transaksi di server!",
        error: error.message,
      },
      { status: 500 },
    );
  }
};
