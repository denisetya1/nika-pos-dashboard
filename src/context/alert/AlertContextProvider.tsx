"use client"

import React, { ReactNode, useState } from 'react'
import { AlertContext, AlertObject } from './AlertContext'

interface AlertProps{
  children: ReactNode
}

const AlertContextProvider = ({ children }: AlertProps) => {
  const [msg, setMsg] = useState<AlertObject|null>(null)

  const setAlert = (message: AlertObject|null) => {
    setMsg(message)
  }

  return (
    <AlertContext.Provider
      value={{
        message: msg,
        setAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContextProvider