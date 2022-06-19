import styles from '@/styles/LoginPopup.module.css'
import { Button } from './SimpleComponents'
import React, { useEffect } from 'react'

const PopupError = ({ setShowPopup, message }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  })

  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>{message}</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.footer}>
            <Button color='blue' click={() => setShowPopup(false)}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupError
