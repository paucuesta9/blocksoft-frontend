import React, { useState, useEffect } from 'react'
import styles from '../styles/CodesTabs.module.css'
import { CodeSection } from './Codes'
import useBlockchain from '../hooks/useBlockchain'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from './Loading'

const tabs = {
  my_codes: 1,
  my_apps: 2,
  created: 3,
  favorites: 4
}

const CodesTabs = ({ activeTabFromURL, user, myCodes, myApps, created, favorited, loading }) => {
  const [activeTab, setActiveTab] = useState(tabs[activeTabFromURL])
  const { currentAccount } = useBlockchain()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setActiveTab(tabs[activeTabFromURL])
  }, [activeTabFromURL])

  return (
    <div className={styles.tabs}>
      <ul className={styles.tabs_list}>
        <li
          className={`${styles.tab} ${activeTab === 1 ? styles.tab_active : ''}`} onClick={() => {
            navigate(location.pathname.replace(/\/[^/]*$/, '/my_codes'))
          }}
        >
          {user.publicAddress?.toLowerCase() === currentAccount.toLowerCase() ? 'My codes' : 'Codes'}
        </li>
        <li
          className={`${styles.tab} ${activeTab === 2 ? styles.tab_active : ''}`} onClick={() => {
            navigate(location.pathname.replace(/\/[^/]*$/, '/my_apps'))
          }}
        >
          {user.publicAddress?.toLowerCase() === currentAccount.toLowerCase() ? 'My apps' : 'Apps'}
        </li>
        <li
          className={`${styles.tab} ${activeTab === 3 ? styles.tab_active : ''}`} onClick={() => {
            navigate(location.pathname.replace(/\/[^/]*$/, '/created'))
          }}
        >
          Created
        </li>
        <li
          className={`${styles.tab} ${activeTab === 4 ? styles.tab_active : ''}`} onClick={() => {
            navigate(location.pathname.replace(/\/[^/]*$/, '/favorites'))
          }}
        >
          Favorited
        </li>
      </ul>
      {loading && <Loading notPopup />}
      <CodeSection codes={activeTabFromURL === 'my_codes' ? myCodes : activeTabFromURL === 'my_apps' ? myApps : activeTabFromURL === 'created' ? created : favorited} />
    </div>
  )
}

export default CodesTabs
