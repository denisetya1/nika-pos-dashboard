import { SVGProps, createContext, useContext } from "react";
import type { FC } from "react";

export interface AlertObject{
    boldContent?: string
    content: string
    color: string
    duration?: number
    icon?: FC<SVGProps<SVGSVGElement>>
}

export interface AlertContextType{
  message: AlertObject|null
  setAlert: (message: AlertObject|null) => void
}

export const AlertContext = createContext<AlertContextType>({
  message: null,
  setAlert(message){}
})

export const useAlertContext = () => useContext(AlertContext)