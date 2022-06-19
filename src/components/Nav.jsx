
import styles from '@/styles/Header.module.css'
import { faBars, faCirclePlus, faClose, faEarthEurope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavAvatar from './NavAvatar'
import useUser from '../hooks/useUser'

const Nav = () => {
  const [open, changeOpen] = useState(false)
  const location = useLocation()
  const { isLogged, signAndLogin } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    changeOpen(false)
  }, [location.pathname, location.search])

  const handleMenu = () => {
    changeOpen(!open)
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (isLogged) {
      navigate('/create')
    } else {
      signAndLogin({ route: '/create' })
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.menuIcon} onClick={handleMenu}>
        <FontAwesomeIcon size='lg' icon={open ? faClose : faBars} />
      </div>
      <div className={`${styles.navList} ${open ? styles.navListOpen : ''}`}>
        <Search nav />
        <div className={styles.navItem}>
          <FontAwesomeIcon className={styles.icon} icon={faEarthEurope} />
          <Link to='/explore'>Explore</Link>
        </div>
        <div className={styles.navItem}>
          <FontAwesomeIcon className={styles.icon} icon={faCirclePlus} />
          <a href='' onClick={handleCreate}>Create</a>
        </div>
        <NavAvatar />
      </div>
    </nav>
  )
}

export default Nav
