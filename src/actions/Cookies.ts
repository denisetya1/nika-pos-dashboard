"use server"

import { cookies } from "next/headers"

export const getCookieString = (): string => {
  const cookieList = cookies().getAll().map((val) => ({...val}))

  return cookieList.reduce((concat, value) => `${concat}; ${value.name}=${value.value}`, '')
}