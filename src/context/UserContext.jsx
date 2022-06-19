import { useState, useEffect, createContext } from 'react'
import Placeholder from '../img/home-background.jpg'

const Context = createContext({})

export function UserProvider ({ children }) {
  const [favs, setFavs] = useState([])
  const [repositories, setRepositories] = useState([])
  const [jwt, setJWT] = useState(
    () => window.sessionStorage.getItem('jwt')
  )
  const [hasGithubToken, setHasGithubToken] = useState(false)
  const [userImage, setUserImage] = useState(Placeholder)

  useEffect(() => {
    if (!jwt) {
      return () => {
        setFavs([])
      }
    }
  }, [jwt])

  return (
    <Context.Provider value={{
      repositories,
      favs,
      jwt,
      hasGithubToken,
      userImage,
      setFavs,
      setJWT,
      setHasGithubToken,
      setRepositories,
      setUserImage
    }}
    >
      {children}
    </Context.Provider>
  )
}

export default Context
