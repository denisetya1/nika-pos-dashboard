export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    "/",
    "/products/:path*",
    "/reports/:path*",
    "/outlets/:path*",
    "/master/:path*",
    "/payments/:path*"
  ]
}