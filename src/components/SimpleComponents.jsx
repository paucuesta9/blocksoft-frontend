import React from 'react'
import styles from '@/styles/SimpleComponents.module.css'

export const Button = ({ children, big, click, ...props }) => {
  return (
    <button className={`${styles.btn} ${styles['btn-' + props.color]} ${big ? styles.big : ''}`} {...props} onClick={click}>
      {children}
    </button>
  )
}
