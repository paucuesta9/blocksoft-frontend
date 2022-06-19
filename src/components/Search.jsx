import styles from '@/styles/Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useClickedOutside from '../hooks/useClickedOutside'
import { searchUsers } from '../services/api/user'
import useBlockchain from '../hooks/useBlockchain'
import getImageUserURL from '../utils/getImageUserURL'
import CodePlaceholder from '../img/code-placeholder.png'

const Search = (props) => {
  const [searchParams] = useSearchParams()
  const searchRef = useRef(null)
  const [search, setSearch] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const [loading, setLoading] = useState({
    codes: false,
    accounts: false
  })
  const [options, setOptions] = useState({
    codes: [],
    accounts: []
  })
  const navigate = useNavigate()
  useClickedOutside(() => setIsOpened(false), searchRef)
  const { searchCodes } = useBlockchain()

  useEffect(() => {
    setSearch(searchParams.get('q') ? searchParams.get('q') : '')
  }, [searchParams])

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search !== '') {
        searchUsers(search).then((response) => {
          setOptions((prevValue) => {
            return {
              codes: prevValue.codes,
              accounts: response.data.map((account) => {
                return {
                  value: account.hash,
                  label: account.username || account.hash,
                  image: getImageUserURL(account.hash)
                }
              })
            }
          })
          setLoading((prevValue) => {
            return {
              codes: prevValue.codes,
              accounts: false
            }
          })
        })
        searchCodes(search).then((response) => {
          setOptions((prevValue) => {
            return {
              codes: response,
              accounts: prevValue.accounts
            }
          })
          setLoading((prevValue) => {
            return {
              codes: false,
              accounts: prevValue.accounts
            }
          })
        })
      }
    }, 2000)

    return () => clearTimeout(delay)
  }, [search])

  const handleInputChange = (e) => {
    setLoading({
      codes: true,
      accounts: true
    })
    if (e.target.value.length > 0) {
      setIsOpened(true)
      setOptions({
        codes: [],
        accounts: []
      })
      setSearch(e.target.value)
    } else {
      setIsOpened(false)
      setSearch('')
      setOptions({
        codes: [],
        accounts: []
      })
    }
  }

  const handleClickCode = (code) => {
    setIsOpened(false)
    setSearch('')
    navigate(`/code/${code}`)
  }

  const handleClickAccount = (account) => {
    navigate(`/profile/${account}`)
    setIsOpened(false)
    setSearch('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${search}`)
    }
  }

  return (
    <div className={styles.select} ref={searchRef}>
      <div className={props.nav ? `${styles.navItem} ${styles.searchbar_nav}` : styles.searchbar}>
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
        <input
          type='text'
          className={styles.searchbar__input}
          placeholder='Search for code, accounts and toppics'
          value={search}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      {isOpened && (
        <div className={styles.options}>
          <div className={styles.options_title}>
            Codes
          </div>
          {options.codes.length > 0
            ? options.codes.map(option => (
              <div className={styles.options_item} key={option.value} onClick={() => handleClickCode(option.value)}>
                {option.image && <img
                  src={option.image} alt={option.label} className={styles.imgOption} onError={(currentTarget) => {
                    console.log('error loading image')
                    currentTarget.target.onerror = null // prevents looping
                    currentTarget.target.src = CodePlaceholder
                  }}
                                 />}
                {option.label}
              </div>
              ))
            : (
              <div className={styles.options_item}>
                {loading.codes ? 'Loading...' : 'No results'}
              </div>
              )}

          <div className={styles.options_title}>
            Accounts
          </div>
          {options.accounts.length > 0
            ? options.accounts.map(option => (
              <div className={styles.options_item} key={option.value} onClick={() => handleClickAccount(option.value)}>
                {option.image && <img src={option.image} alt={option.label} className={styles.imgOption} />}
                {option.label}
              </div>
              ))
            : (
              <div className={styles.options_item}>
                {loading.accounts ? 'Loading...' : 'No results'}
              </div>
              )}
        </div>
      )}
    </div>
  )
}

export default Search
