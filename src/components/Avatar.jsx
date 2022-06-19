import React from 'react'
import styles from '@/styles/Header.module.css'

const Avatar = ({ src, alt, zoomed, handleClick, small }) => {
  return (
    <figure className={`${styles.avatar} ${small ? styles.small : ''}`}>
      <img
        onClick={handleClick}
        src={src}
        alt={alt}
        className={`${zoomed ? styles.zoomed : ''}`}
      />
    </figure>
  )
}

export default Avatar
