import { shortenAddress } from '../utils/shortenAddress'
import EthereumLogo from '../img/ethereum.svg'
import styles from '@/styles/Address.module.css'
import React, { useState } from 'react'

const Address = ({ address }) => {
  const [showPopUp, setShowPopUp] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setShowPopUp(true)
    setTimeout(() => {
      setShowPopUp(false)
    }, 2000)
  }

  return (
    <div className={styles.container} onClick={copyAddress}>
      {showPopUp && <p className={styles.popUp}>Copied!</p>}
      <figure>
        <img src={EthereumLogo} height={24} alt='ethereum icon' />
      </figure>
      <div>
        <span>{shortenAddress(address || '')}</span>
      </div>
    </div>
  )
}

export default Address
