// gunakan require, bukan import jika file-nya .js biasa
const { prisma } = require("../src/lib/client.ts");

async function main() {
  console.log("Memulai proses fetch data...");

  const txs = await prisma.transaction.findMany({
    where: {
      outletPaymentMethod: {
        paymentMethodId: 4,
      },
    },
  });

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

  for (const d of txs) {
    const marketplaces = d.cardNumber ? d.cardNumber.split("/") : [];
    const couriers = d.confirmNumber ? d.confirmNumber.split("/") : [];

    // HAPUS TYPE ANNOTATION (: number | undefined) NYA DI SINI
    let marketplaceId;
    let courierId;

    if (marketplaces[0]) {
      const textToSearch = marketplaces[0].trim();
      const index = map.indexOf(textToSearch);
      if (index !== -1) marketplaceId = index + 1;
    }

    if (couriers[0]) {
      const textToSearch = couriers[0].trim();
      const index = cr.indexOf(textToSearch);
      if (index !== -1) courierId = index + 1;
    }

    try {
      const u = await prisma.transaction.update({
        where: { id: d.id },
        data: {
          marketplace: marketplaceId
            ? { connect: { id: marketplaceId } }
            : undefined,
          courier: courierId ? { connect: { id: courierId } } : undefined,
        },
      });
      console.log(`${u.id} ===> success`);
    } catch (error) {
      console.error(`Gagal update transaksi ID ${d.id}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error("Terjadi error utama:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
