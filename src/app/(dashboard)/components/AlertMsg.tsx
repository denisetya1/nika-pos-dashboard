"use client"

import { useAlertContext } from '@/context/alert/AlertContext'
import { Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';

const AlertMsg = () => {
  const [showAlert, setShowAlert] = useState(false)
  const { message, setAlert } = useAlertContext()

  useEffect(() => {
    if(message !== null){
      setShowAlert(true);

      if(message?.duration != -1){
        setTimeout(() => {
          setAlert(null);
        }, message?.duration ? message?.duration : 5000)
      }
    }
  }, [ message, setAlert ])

  return (
    <>
      { showAlert && message !== null && <Alert 
          color={message?.color} 
          icon={message?.icon}
          rounded
        >
          {message?.boldContent && <span className="font-medium">{message?.boldContent}</span>} 
          {message?.content}
        </Alert> }
    </>
  )
}

export default AlertMsg