import MetamaskGif from '../img/metamask.gif'
import styles from '@/styles/LoginPopup.module.css'
import React, { useEffect } from 'react'
import useBlockchain from '../hooks/useBlockchain'

const LoginPopUp = () => {
  const { login } = useBlockchain()

  useEffect(() => {
    login()
  }, [])

  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Connect your Metamask wallet to use the APP</h2>
        </div>
        <div className={styles.body}>
          <img src={MetamaskGif} alt='metamask' />
        </div>
      </div>
    </div>
  )
}

export default LoginPopUp
