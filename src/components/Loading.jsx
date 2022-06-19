import styles from '@/styles/LoginPopup.module.css'
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'

const Loading = ({ message, notPopup }) => {
  return (
    <div className={`${!notPopup && styles.popup} ${styles.loading}`}>
      <div className={!notPopup && styles.content}>
        <div className={styles.header}>
          <h2>{message || 'Loading...'}</h2>
        </div>
        <div className={styles.body}>
          <Player
            autoplay
            loop
            src='https://assets8.lottiefiles.com/packages/lf20_Stt1R6.json'
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Loading
