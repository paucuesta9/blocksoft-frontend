import { createContext, useEffect, useState } from 'react'
const { ethereum } = window

export const EthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccout] = useState('')
  const [codes, setCodes] = useState([])

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        setCurrentAccout(accounts[0])
      } else console.log('No accounts found')
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }

  useEffect(() => {
    if (currentAccount === '') {
      return () => {
        setCurrentAccout('')
        setCodes([])
      }
    }
    checkIfWalletIsConnected()
  }, [])

  return (
    <EthContext.Provider value={{
      currentAccount,
      codes,
      setCurrentAccout,
      setCodes
    }}
    >
      {children}
    </EthContext.Provider>
  )
}

export const EthContext = createContext()
