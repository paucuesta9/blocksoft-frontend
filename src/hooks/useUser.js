import { ethers } from 'ethers'
import { useCallback, useContext, useEffect } from 'react'
import useBlockchain from './useBlockchain'
import Context from '../context/UserContext'
import { authUser, fetchUser } from '../services/api/auth'
import { useNavigate } from 'react-router-dom'
import instance from '../components/axios'
import getImageUserURL from '../utils/getImageUserURL'
import { like, unlike } from '../services/api/likes'

const { ethereum } = window

export default function useUser () {
  const { favs, jwt, userImage, hasGithubToken, setJWT, setFavs, setUserImage, setHasGithubToken, repositories } = useContext(Context)
  const { isLogged, currentAccount, login } = useBlockchain()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentAccount !== '') setUserImage(getImageUserURL(currentAccount))
  }, [currentAccount, userImage])

  const signAndLogin = async ({ route, callback, param }) => {
    let currentAccountLogin = currentAccount

    if (!isLogged) {
      try {
        currentAccountLogin = await login()
      } catch {
        return
      }
    }

    fetchUser(currentAccountLogin)
      .then((response) => {
        new ethers.providers.Web3Provider(ethereum).getSigner().signMessage(response.data.nonce).then((signature) => {
          authUser(currentAccountLogin, signature).then((response) => {
            instance.defaults.headers.common.Authorization = 'Bearer ' + response.data.token
            setJWT(response.data.token)

            if (response.data.githubToken) setHasGithubToken(true)
            if (route) {
              navigate(route)
            }
            if (callback) {
              callback(param)
            }
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log({ error })
        })
      })
  }

  const likeCode = useCallback(async (tokenId) => {
    const response = await like(tokenId)
    if (response.status === 201) {
      setFavs([...favs, tokenId])
      return true
    }
    return false
  }, [])

  const unlikeCode = useCallback(async (tokenId) => {
    const response = await unlike(tokenId)
    if (response.status === 200) {
      setFavs(favs.filter(fav => fav !== tokenId))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    window.sessionStorage.removeItem('jwt')
    setJWT(null)
    setHasGithubToken(false)
    setFavs([])
    setUserImage(null)
  }, [setJWT])

  return {
    setFavs,
    favs,
    userImage,
    isLogged: jwt !== null,
    hasGithubToken,
    repositories,
    signAndLogin,
    logout,
    likeCode,
    unlikeCode,
    setUserImage,
    setHasGithubToken
  }
}
