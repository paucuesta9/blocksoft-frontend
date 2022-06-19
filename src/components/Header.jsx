import styles from '@/styles/Header.module.css'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import Search from './Search'
import React from 'react'

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to='/'><h1>Blocksoft</h1></Link>
      <Search />
      <Nav />
    </header>
  )
}

export default Header
