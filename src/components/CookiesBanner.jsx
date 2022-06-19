import React, { useEffect, useState } from 'react'
import styles from '@/styles/CookiesBanner.module.css'
import { Button } from './SimpleComponents'
import { Link } from 'react-router-dom'

const CookiesBanner = () => {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('cookies_accepted='))
    if (cookie) {
      setAccepted(true)
    }
  }, [document.cookie])

  const handleAccepted = () => {
    setAccepted(true)
    document.cookie = 'cookies_accepted=true'
  }

  return (
    <>
      {!accepted && (
        <div className={styles.banner}>
          <div className={styles.text}>
            <p>
              This website uses cookies to ensure you get the best experience on
              our website.
            </p>
            <Link to='/cookies_policy'>Learn more</Link>
          </div>
          <Button click={() => handleAccepted()}>Accept</Button>
        </div>
      )}
    </>
  )
}

export default CookiesBanner
