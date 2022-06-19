import React, { useEffect, useState } from 'react'
import Address from '../components/Address'
import styles from '../styles/Profile.module.css'
import Placeholder from '../img/placeholder.jpg'
import { getUser } from '../services/api/user'
import CodesTabs from '../components/CodesTabs'
import { useParams } from 'react-router-dom'
import getImageUserURL from '../utils/getImageUserURL'
import useBlockchain from '../hooks/useBlockchain'
import useUser from '../hooks/useUser'
import { BigNumber } from 'ethers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Profile = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})
  const { hash, section } = useParams()
  const [codes, setCodes] = useState({
    myCodes: [],
    myApps: [],
    created: [],
    favorited: []
  })
  const {
    getOwnerCodes,
    getCodesCreated,
    getFavoriteCodes
  } = useBlockchain()
  const { setFavs } = useUser()

  useEffect(() => {
    if (hash !== '') {
      getUser(hash)
        .then(async (response) => {
          setUser(response.data)
          const userCodes = await getOwnerCodes(hash)
          const createdCodes = await getCodesCreated(hash)
          const favoriteTokens = response.data.liked.map(token => BigNumber.from(token.token_id))
          setFavs(favoriteTokens)
          const favoritedCodes = await getFavoriteCodes(favoriteTokens)
          setCodes({
            myCodes: userCodes.filter(code => code.type === 'code'),
            myApps: userCodes.filter(code => code.type === 'app'),
            created: createdCodes,
            favorited: favoritedCodes
          })
          setLoading(false)
        }).catch((error) => {
          console.log(error)
        })
    }
  }, [hash])

  return (
    <main className={styles.container}>
      <header>
        <figure className={styles.avatar}>
          {user.image ? <img src={getImageUserURL(user.publicAddress)} alt={user.name} /> : <img src={Placeholder} alt={user.name} />}
        </figure>
        <div className={styles.userInfo}>
          <div>
            <h1>{user.username ? user.username : 'undefined'}</h1>
            {/* <Address address='0xC117aDa59a2244594B967eFB9eD43663BB3c7F6D' /> */}
            <Address address={user.publicAddress} />
          </div>
          <p>{user.description}</p>
          {user.website && (
            <div className={styles.socialLink}>
              <FontAwesomeIcon icon={faLink} />
              <a href={user.website} target='_blank' rel='noopener noreferrer'>{user.website}</a>
            </div>
          )}
          {user.twitter && (
            <div className={styles.socialLink}>
              <FontAwesomeIcon icon={faTwitter} />
              <a href={user.twitter} target='_blank' rel='noopener noreferrer'>{user.twitter.split('/')[user.twitter.split('/').length - 1]}</a>
            </div>
          )}
          {user.github && (
            <div className={styles.socialLink}>
              <FontAwesomeIcon icon={faGithub} />
              <a href={user.github} target='_blank' rel='noopener noreferrer'>{user.github.split('/')[user.github.split('/').length - 1]}</a>
            </div>
          )}
          {user.linkedin && (
            <div className={styles.socialLink}>
              <FontAwesomeIcon icon={faLinkedin} />
              <a href={user.linkedin} target='_blank' rel='noopener noreferrer'>{user.linkedin.split('/')[user.linkedin.split('/').length - 1]}</a>
            </div>
          )}
        </div>
      </header>
      <section className={styles.section}>
        <CodesTabs loading={loading} activeTabFromURL={section || 'my_codes'} user={user} myCodes={codes.myCodes} myApps={codes.myApps} created={codes.created} favorited={codes.favorited} />
      </section>
    </main>
  )
}

export default Profile
