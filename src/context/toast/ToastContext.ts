import { SVGProps, createContext, useContext } from "react";
import type { FC } from "react";

export interface ToastMsgObject{
    content: string
    type: string
    placement?: string
    duration?: number
    icon?: FC<SVGProps<SVGSVGElement>>
}

export interface ToastContextType{
  message: ToastMsgObject|null
  setToast: (message: ToastMsgObject|null) => void
}

export const ToastContext = createContext<ToastContextType>({
  message: null,
  setToast(message){}
})

export const useToastContext = () => useContext(ToastContext)