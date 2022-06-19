import styles from '../styles/CodesComponents.module.css'
import { Link } from 'react-router-dom'
import { langToImage } from '../utils/langToImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import useUser from '../hooks/useUser'
import Loading from './Loading'
import React from 'react'

export const CodeSection = ({ codes, loading }) => {
  return (
    <div className={styles.tabs_content}>
      {loading
        ? <Loading notPopup message=' ' />
        : (codes.length > 0
            ? codes.map(code => (
              <CodeItem key={code.id} code={code} />
              ))
            : <div className={styles.no_codes}>
              <p>No codes found</p>
              </div>)}
    </div>
  )
}

export const CodeItem = ({ code }) => {
  const { likeCode, unlikeCode, isLogged, signAndLogin, favs } = useUser()

  const handleLikeCode = (e) => {
    e.preventDefault()
    if (!isLogged) {
      signAndLogin({
        callback: () => {
          if (favs.findIndex(fav => fav.eq(code.id)) !== -1) {
            unlikeCode(code.id)
            code.likes = code.likes - 1
          } else {
            likeCode(code.id)
            code.likes = (code.likes || 0) + 1
          }
        }
      })
    } else if (favs.findIndex(fav => fav.eq(code.id)) !== -1) {
      unlikeCode(code.id)
      code.likes = code.likes - 1
    } else {
      likeCode(code.id)
      code.likes = (code.likes || 0) + 1
    }
  }

  return (
    <Link to={`/code/${code.id}`}>
      <div className={styles.tabs_content_item} key={code.id}>
        <figure className={styles.tabs_content_item_img}>
          <img
            src={code.image} alt={code.title} onError={e => {
              e.target.src = typeof code.language === 'string' ? langToImage[code.language.toLowerCase()] : langToImage.kotlin
              e.onerror = null
            }}
          />
        </figure>
        <div className={styles.tabs_content_item_info}>
          {code.owner && (
            <Link to={`/profile/${code.owner}`} className={styles.tabs_content_item_ownerImage}>
              <img
                src={code.ownerImage} alt={code.owner} onError={e => {
                  e.target.src = langToImage.java
                  e.onerror = null
                }}
              />
            </Link>
          )}
          <h3 className={styles.tabs_content_item_info_title}>{code.title}</h3>
          <p className={styles.tabs_content_item_info_description}>
            {code.description}
          </p>
          <div className={styles.tabs_content_item_info_heart} onClick={handleLikeCode}>
            <FontAwesomeIcon color='red' icon={favs.findIndex(fav => fav.eq(code.id)) !== -1 ? faHeartSolid : faHeart} />
            <span>{code.likes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
