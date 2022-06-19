import React from 'react'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '../styles/SimpleComponents.module.css'

const Tag = ({ tag, removeTag, index }) => {
  return (
    <span className={`${styles.tag} ${index !== undefined ? styles.tagWithDetele : ''}`}>
      {tag}
      {index !== undefined && (
        <span className={styles.tagClose} onClick={() => removeTag(index)}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      )}
    </span>
  )
}

export default Tag
