"use client"

import React, { ReactNode, useState } from 'react'
import { ToastContext, ToastMsgObject } from './ToastContext'

interface ToastProps{
  children: ReactNode
}

const ToastContextProvider = ({ children }: ToastProps) => {
  const [msg, setMsg] = useState<ToastMsgObject|null>(null)

  const setToast = (message: ToastMsgObject|null) => {
    setMsg(message)
  }

  return (
    <ToastContext.Provider
      value={{
        message: msg,
        setToast
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContextProvider