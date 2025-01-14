import { withAuth } from "next-auth/middleware"

export default withAuth(
  {
    callbacks: {
      authorized: ({ req, token }) => {

        const path = req.nextUrl.pathname
        if (path.startsWith('/api/pos')) {

          return true;
        }

        return !!token
      },
    },
  }
)


export const config = {
  matcher: [
    "/",
    "/(dashboard)/:path*",
    "/products/:path*",
    "/reports/:path*",
    "/outlets/:path*",
    "/master/:path*",
    "/users/:path*",
    "/api/:path*",
  ]
}