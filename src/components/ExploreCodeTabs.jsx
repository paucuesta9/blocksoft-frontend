import React, { useState, useEffect } from 'react'
import styles from '../styles/CodesTabs.module.css'
import { CodeSection } from './Codes'
import useBlockchain from '../hooks/useBlockchain'
import { getMostViewed } from '../services/api/codes'
import Loading from './Loading'
import { BigNumber } from 'ethers'
import { tabNameToId } from '../utils/tabNameToId'

const ExploreCodeTabs = ({ selectedTab }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [codes, setCodes] = useState([])
  const [filteredCodes, setFilteredCodes] = useState([])
  const [mostViewed, setMostViewed] = useState([])
  const [loading, setLoading] = useState(true)
  const { getCodes } = useBlockchain()

  useEffect(() => {
    const getAllCodes = async () => {
      const codesBlockchain = await getCodes()
      setCodes(codesBlockchain)
      setFilteredCodes(codesBlockchain.reverse())
      setLoading(false)
      const { data: mostViewed } = await getMostViewed()
      if (mostViewed.length > 0) setMostViewed(mostViewed.map(code => code.token_id))
    }
    getAllCodes()
  }, [])

  useEffect(() => {
    if (selectedTab !== undefined) handleChangeTab(tabNameToId[selectedTab])
    window.scrollTo(0, 0)
  }, [selectedTab])

  const handleChangeTab = (num) => {
    setLoading(true)
    setActiveTab(num)
    setFilteredCodes([])
    switch (num) {
      case 1:
        setFilteredCodes(codes.reverse())
        break
      case 2:
        if (mostViewed.length > 0) {
          setFilteredCodes(codes
            .filter(code => mostViewed.findIndex(codeV => BigNumber.from(codeV).eq(code.id)) !== -1)
            .sort((a, b) => {
              const indexA = mostViewed.findIndex(code => BigNumber.from(code).eq(a.id))
              const indexB = mostViewed.findIndex(code => BigNumber.from(code).eq(b.id))
              return indexA - indexB
            }))
        }
        break
      case 3:
        setFilteredCodes(codes
          .filter(code => code.likes > 0)
          .sort((a, b) => b.likes - a.likes))
        break
      case 4:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'javascript'))
        break
      case 5:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'java'))
        break
      case 6:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'kotlin'))
        break
      case 7:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'python'))
        break
      case 8:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'ruby'))
        break
      case 9:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'solidity'))
        break
      case 10:
        setFilteredCodes(codes.filter(code => code.language.toString().toLowerCase() === 'a sharp (.net)'))
        break
      default:
        break
    }
    setLoading(false)
  }

  return (
    <div className={styles.tabs}>
      <ul className={styles.tabs_list_explore}>
        <li className={`${styles.tab} ${activeTab === 1 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(1)}>
          Newest
        </li>
        <li className={`${styles.tab} ${activeTab === 2 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(2)}>
          Top Views
        </li>
        <li className={`${styles.tab} ${activeTab === 3 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(3)}>
          Top Rated
        </li>
        <li className={`${styles.tab} ${activeTab === 4 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(4)}>
          Javascript
        </li>
        <li className={`${styles.tab} ${activeTab === 5 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(5)}>
          Java
        </li>
        <li className={`${styles.tab} ${activeTab === 6 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(6)}>
          Kotlin
        </li>
        <li className={`${styles.tab} ${activeTab === 7 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(7)}>
          Python
        </li>
        <li className={`${styles.tab} ${activeTab === 8 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(8)}>
          Ruby
        </li>
        <li className={`${styles.tab} ${activeTab === 9 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(9)}>
          Solidity
        </li>
        <li className={`${styles.tab} ${activeTab === 10 ? styles.tab_active : ''}`} onClick={() => handleChangeTab(10)}>
          .NET
        </li>
      </ul>
      {loading && <Loading notPopup />}
      <CodeSection codes={filteredCodes} />
    </div>
  )
}

export default ExploreCodeTabs
