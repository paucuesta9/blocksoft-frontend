import Avatar from './Avatar'
import styles from '@/styles/Header.module.css'
import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faCode, faGear } from '@fortawesome/free-solid-svg-icons'
import { faHeart, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useBlockchain from '../hooks/useBlockchain'
import useUser from '../hooks/useUser'
import useClickedOutside from '../hooks/useClickedOutside'

const NavAvatar = () => {
  const menu = useRef(null)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { currentAccount, login } = useBlockchain()
  const { userImage, isLogged, signAndLogin, logout } = useUser()
  const navigate = useNavigate()

  useClickedOutside(() => setOpen(false), menu)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  const handleClick = () => {
    if (currentAccount === '') { login() } else { setOpen(!open) }
  }

  const handleSettings = (e) => {
    e.preventDefault()
    if (isLogged) {
      navigate('/account/edit')
    } else {
      signAndLogin({ route: '/account/edit' })
    }
  }

  return (
    <div className={styles.navAvatarParent} ref={menu}>
      <Avatar handleClick={handleClick} src={userImage} alt='avatar' zoomed />
      <nav className={`${styles.navAvatar} ${open && styles.navAvatarOpen}`}>
        <ul>
          <Link to={`/profile/${currentAccount}/my_codes`}>
            <li>
              <FontAwesomeIcon icon={faUserCircle} />
              Profile
            </li>
          </Link>
          <Link to={`/profile/${currentAccount}/my_apps`}>
            <li>
              <FontAwesomeIcon icon={faCode} />
              My Apps
            </li>
          </Link>
          <Link to={`/profile/${currentAccount}/favorites`}>
            <li>
              <FontAwesomeIcon icon={faHeart} />
              Favorites
            </li>
          </Link>
          <a onClick={handleSettings} className={styles.link}>
            <li>
              <FontAwesomeIcon icon={faGear} />
              Settings
            </li>
          </a>
          <a onClick={logout} className={styles.link}>
            <li>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              Log out
            </li>
          </a>
        </ul>
      </nav>
    </div>
  )
}

export default NavAvatar
