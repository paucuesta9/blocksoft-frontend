import styles from '@/styles/Footer.module.css'
import { faTwitter, faInstagram, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import React from 'react'

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.rrss}>
        <a href='https://twitter.com/paucuesta9' target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faTwitter} color='#fff' size='2x' />
        </a>
        <a href='https://www.instagram.com/paucuesta9/' target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faInstagram} color='#fff' size='2x' />
        </a>
        <a href='https://www.facebook.com/pau.cuesta.9/' target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faFacebook} color='#fff' size='2x' />
        </a>
        <a href='https://www.youtube.com/channel/UCmHRP97rJDRKyIEBMZpPaiw' target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faYoutube} color='#fff' size='2x' />
        </a>
        <a href='mailto:pcuesta@stp.es' target='_blank' rel='noopener noreferrer'>
          <FontAwesomeIcon icon={faEnvelope} color='#fff' size='2x' />
        </a>
      </div>
      <main className={styles.main}>
        <div className={styles.content_column}>
          <Link to='/home'>Home</Link>
          <Link to='/create'>Create</Link>
        </div>
        <div className={styles.content_column}>
          <h5>Explore</h5>
          <Link to='/explore/rated'>Most rated</Link>
          <Link to='/explore/viewed'>Most Viewed</Link>
          <Link to='/explore/newest'>Newest</Link>
          <Link to='/explore/javascript'>Javascript</Link>
          <Link to='/explore/java'>Java</Link>
        </div>
        <div className={styles.content_column}>
          <h5>My account</h5>
          <Link to='/profile'>Profile</Link>
          <Link to='/profile/my_apps'>My apps</Link>
          <Link to='/profile/my_codes'>My codes</Link>
          <Link to='/profile/created'>Created</Link>
          <Link to='/profile/favorited'>Favorited</Link>
        </div>
        <div className={styles.content_column}>
          <Link to='/cookies_policy'>Cookies policy</Link>
          <Link to='/privacy_policy'>Privacy policy</Link>
          <Link to='/terms_service'>Terms of service</Link>
        </div>

      </main>
      <div className={styles.copyright}>
        <p>© 2022 STP GROUP</p>
      </div>
    </footer>
  )
}

export default Footer
