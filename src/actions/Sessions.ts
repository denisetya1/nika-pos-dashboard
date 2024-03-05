"use server"

import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"

export const getSessionData = async () => {
  const session = await getServerSession(authOptions)

  return session
}