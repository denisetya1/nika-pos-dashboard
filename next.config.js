/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Menangkap semua URL yang masuk (termasuk sub-folder dan query params)
        source: "/:path*",
        // Alihkan ke domain baru Anda diikuti oleh path yang sama
        destination: "https://nika-pos.beautycat.id/",
        // permanent: true akan menghasilkan HTTP Status 301 (Permanent Redirect)
        // permanent: false akan menghasilkan HTTP Status 307 (Temporary Redirect)
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
