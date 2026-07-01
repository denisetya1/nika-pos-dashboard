// gunakan require, bukan import jika file-nya .js biasa
const { prisma } = require("../src/lib/client.ts");

async function main() {
  console.log("Memulai proses ekstrak No. Resi dan Marketplace Reff ID...");

  // Ambil transaksi online yang data nomor/struknya terisi
  const txs = await prisma.transaction.findMany({
    where: {
      marketplaceId: {
        not: null, // Hanya memproses yang merupakan transaksi marketplace
      },
    },
  });

  console.log(`Menemukan ${txs.length} transaksi untuk diproses.`);

  for (const d of txs) {
    const marketplaces = d.cardNumber ? d.cardNumber.split("/") : [];
    const couriers = d.confirmNumber ? d.confirmNumber.split("/") : [];

    // Ambil bagian kanan setelah tanda "/"
    // Contoh: "Shopee/REF-9923" -> "REF-9923"
    const extractedReffId = marketplaces[1] ? marketplaces[1].trim() : null;

    // Contoh: "SPX-Instant/260601V5XN" -> "260601V5XN"
    const extractedTrackingNum = couriers[1] ? couriers[1].trim() : null;

    // Jika keduanya kosong di data transaksi ini, lewati untuk menghemat query DB
    if (!extractedReffId && !extractedTrackingNum) {
      continue;
    }

    try {
      const u = await prisma.transaction.update({
        where: { id: d.id },
        data: {
          // Hanya isi jika data hasil ekstraknya ada (tidak null)
          marketplaceReffId: extractedReffId || undefined,
          trackingNumber: extractedTrackingNum || undefined,
        },
      });

      console.log(
        `ID: ${u.id} ===> Resi: ${u.trackingNumber || "-"} | Reff ID: ${u.marketplaceReffId || "-"}`,
      );
    } catch (error) {
      console.error(`❌ Gagal update tracking data pada ID ${d.id}:`, error);
    }
  }

  console.log("🚀 Semua data selesai diproses!");
}

main()
  .catch((e) => {
    console.error("Terjadi error utama:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
