import React, { useState, useEffect } from 'react'
import LoginPopUp from '../components/LoginPopup'
import { Button } from '../components/SimpleComponents'
import styles from '@/styles/Home.module.css'
import { langToImage } from '../utils/langToImage'
import { CodeSection } from '../components/Codes'
import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import useBlockchain from '../hooks/useBlockchain'
import { getMostViewed, getMostRated } from '../services/api/codes'
import useUser from '../hooks/useUser'
import { BigNumber } from 'ethers'
import PopupError from '../components/PopupError'

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentAccount, getFavoriteCodes, getCodes } = useBlockchain()
  const { isLogged, signAndLogin } = useUser()
  const [imageLogo, setImageLogo] = useState(langToImage.javascript)
  const [i, setI] = useState(0)
  const [codes, setCodes] = useState({
    viewed: [],
    rated: []
  })
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    // const codes = getUserCodes()
    const timer = setInterval(() => {
      setI(prevI => prevI + 1)
      const lang = Object.values(langToImage)[i % Object.keys(langToImage).length]
      setImageLogo(lang)
    }, 5000)

    return () => clearInterval(timer)
  }, [i])

  useEffect(async () => {
    if (location.state?.message !== '' && location.state?.message !== undefined) {
      setShowPopup(true)
    }
    setLoading(true)
    let { data: mostViewed } = await getMostViewed()
    let mostViewedCodes = []
    if (mostViewed.length > 0) {
      mostViewedCodes = await getFavoriteCodes(mostViewed.map(code => code.token_id))
      mostViewedCodes = mostViewedCodes.sort((a, b) => {
        const indexA = mostViewed.findIndex(code => BigNumber.from(code.token_id).eq(a.id))
        const indexB = mostViewed.findIndex(code => BigNumber.from(code.token_id).eq(b.id))
        return indexA - indexB
      })
    } else {
      mostViewedCodes = await getCodes()
    }
    mostViewed = mostViewedCodes.slice(0, 3)
    let { data: mostRated } = await getMostRated()
    if (mostRated.length > 0) {
      mostRated = await getFavoriteCodes(mostRated.map(code => code.token_id))
      mostRated = mostRated.sort((a, b) => b.likes - a.likes)
    } else {
      mostRated = await getCodes()
    }
    mostRated = mostRated.slice(0, 3)
    setCodes({
      viewed: mostViewed,
      rated: mostRated
    })
    setLoading(false)
  }, [])

  const handleCreateButton = (e) => {
    e.preventDefault()
    if (isLogged) {
      navigate('/create')
    } else {
      signAndLogin({ route: '/create' })
    }
  }

  return (
    <>
      {(location.state?.requireLogin || false) && currentAccount === '' && <LoginPopUp from={from} />}
      {showPopup && <PopupError setShowPopup={setShowPopup} message={location.state?.message} />}
      <Helmet>
        <title>Home | Blocksoft</title>
      </Helmet>
      <main>
        <div className={styles.background}>
          <header className={styles.container}>
            <div className={styles.header}>
              <div className={styles.containerTitle}>
                <h1>Blocksoft</h1>
                <h2>Your blockchain code manager</h2>
              </div>
              <Button click={handleCreateButton} color='blue' big>Create</Button>
            </div>
            <div className={styles.headerImage}>
              <img src={imageLogo} alt='javascript logo' />
            </div>
          </header>
        </div>
        <section className={styles.container}>
          <div className={styles.codeListSection}>
            <h3>Top Views</h3>
            <CodeSection codes={codes.viewed} loading={loading} />
          </div>
        </section>
        <section className={styles.container}>
          <div className={styles.codeListSection}>
            <h3>Top Rated</h3>
            <CodeSection codes={codes.rated} loading={loading} />
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
