"use client"

import { useToastContext } from '@/context/toast/ToastContext'
import { Toast } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiCheck, HiExclamation, HiX } from 'react-icons/hi'

const ToastMsg = () => {
  const [showToast, setShowToast] = useState(false)
  const { message, setToast } = useToastContext()
  const [ color, setColor ] = useState('green')
  const [ placement, setPlacement ] = useState('fixed bottom-5 right-5')

  useEffect(() => {
    if(message !== null){
      setShowToast(true)

      switch (message.type){
        case 'success':
          setColor('green')
        break;
        case 'error':
          setColor('red')
        break;
        case 'warning':
          setColor('orange')
        break;
      }

      switch (message.placement){
        case 'top-left':
          setPlacement('fixed top-5 left-5')
        break;
        case 'top-right':
          setPlacement('fixed top-5 right-5')
        break;
        case 'bottom-left':
          setPlacement('fixed bottom-5 left-5')
        break;
        case 'bottom-right':
          setPlacement('fixed bottom-5 right-5')
        break;
      }

      if(message?.duration !== -1){
        setTimeout(() => {
          setToast(null);
        }, message?.duration ? message?.duration : 5000)
      }

    } else {
      setShowToast(false)
    }
  }, [message, setToast])

  return (
    <>
      {showToast && <Toast className={placement}>
        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-${color}-100 text-${color}-500 dark:bg-${color}-800 dark:text-${color}-200`}>
          {message?.type === 'success' && <HiCheck className="h-5 w-5" />}
          {message?.type === 'error' && <HiX className="h-5 w-5" />}
          {message?.type === 'warning' && <HiExclamation className="h-5 w-5" />}
        </div>
        <div className="ml-3 text-sm font-normal">{message?.content}</div>
        <Toast.Toggle />
      </Toast>}
    </>
  )
}

export default ToastMsg