import { BigNumber } from 'ethers'
import React, { useCallback, useContext, useState } from 'react'
import { EthContext } from '../context/EthContext'
import { getAllCodes, createNFT, getUriURL, getUri, getUserOwnerCodes, getCodesCreatedByUser, getFavoritesCodes, getCode, getHistoryTransactions, transfer } from '../services/blockchain/codes'
import { uploadFile } from '../services/blockchain/ipfs'
import { encryptFile } from '../utils/encrypt'
import { getLikes } from '../services/api/likes'
import { getUser } from '../services/api/user'
import { useNavigate } from 'react-router-dom'

const ipfsURL = 'http://localhost:8080/ipfs/'

// const API_URL = import.meta.env.VITE_API_URL
const API_URL = 'test_url'

export default function useBlockchain () {
  const { ethereum } = window
  const { currentAccount, setCurrentAccout, setCodes } = useContext(EthContext)
  const navigate = useNavigate()

  const login = useCallback(async () => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccout(accounts[0])
      return accounts[0]
    } catch (error) {
      console.log({ error })
      navigate('/', { state: { message: 'Error. Please, try again later' } })
      throw new Error('No ethereum object found')
    }
  }, [setCurrentAccout])

  const getCodes = useCallback(async () => {
    try {
      const userCodes = await getAllCodes()
      let structuredCodes = userCodes.map((code) => ({
        tokenId: code.tokenId,
        createdBy: code['1'],
        owner: code.owner
      }))

      structuredCodes = await Promise.all(structuredCodes.map(async (code) => {
        const uriURL = await getUriURL(code.tokenId)
        let likes = 0
        try {
          likes = await getLikes(code.tokenId)
          likes = likes.data
        } catch {
          likes = 0
        }
        if (!uriURL.includes('undefined')) {
          const { data: uri } = await getUri(uriURL)
          return { ...code, uri, likes }
        }
        return { ...code, likes }
      }))

      structuredCodes = structuredCodes.map(code => {
        if (code.uri) {
          return {
            id: code.tokenId,
            title: code.uri.name,
            description: code.uri.description,
            language: code.uri.attributes.language,
            image: code.uri.image,
            code: code.uri.code,
            owner: code.owner,
            tags: code.uri.attributes.tags.split(',').filter((tag) => tag !== ''),
            type: code.uri.attributes.type,
            ownerImage: API_URL + '/users/' + code.owner + '/image',
            likes: code.likes.liked
          }
        } else {
          return code
        }
      })

      return structuredCodes
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [setCodes, setCurrentAccout])

  const getOwnerCodes = useCallback(async (userAddress) => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')

      const userCodes = await getUserOwnerCodes(userAddress)
      let structuredCodes = userCodes.map((code) => ({
        tokenId: code.tokenId,
        createdBy: code['1'],
        owner: code.owner
      }))

      structuredCodes = await Promise.all(structuredCodes.map(async (code) => {
        const uriURL = await getUriURL(code.tokenId)
        let likes = 0
        try {
          likes = await getLikes(code.tokenId)
          likes = likes.data
        } catch {
          likes = 0
        }
        if (!uriURL.includes('undefined')) {
          const { data: uri } = await getUri(uriURL)
          return { ...code, uri, likes }
        }
        return { ...code, likes }
      }))

      structuredCodes = structuredCodes.map(code => {
        return {
          id: code.tokenId,
          title: code.uri.name,
          description: code.uri.description,
          language: code.uri.attributes.language,
          image: code.uri.image,
          code: code.uri.code,
          owner: code.owner,
          tags: code.uri.attributes.tags.split(',').filter((tag) => tag !== ''),
          type: code.uri.attributes.type,
          ownerImage: API_URL + '/users/' + code.owner + '/image',
          likes: code.likes.liked
        }
      })

      return structuredCodes
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [])

  const getCodesCreated = useCallback(async (userAddress) => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')

      const userCodes = await getCodesCreatedByUser(userAddress)
      let structuredCodes = userCodes.map((code) => ({
        tokenId: code.tokenId,
        createdBy: code['1'],
        owner: code.owner
      }))

      structuredCodes = await Promise.all(structuredCodes.map(async (code) => {
        const uriURL = await getUriURL(code.tokenId)
        let likes = 0
        try {
          likes = await getLikes(code.tokenId)
          likes = likes.data
        } catch {
          likes = 0
        }
        if (!uriURL.includes('undefined')) {
          const { data: uri } = await getUri(uriURL)
          return { ...code, uri, likes }
        }
        return { ...code, likes }
      }))

      structuredCodes = structuredCodes.map(code => {
        return {
          id: code.tokenId,
          title: code.uri.name,
          description: code.uri.description,
          language: code.uri.attributes.language,
          image: code.uri.image,
          code: code.uri.code,
          owner: code.owner,
          tags: code.uri.attributes.tags.split(',').filter((tag) => tag !== ''),
          type: code.uri.attributes.type,
          ownerImage: API_URL + '/users/' + code.owner + '/image',
          likes: code.likes.liked
        }
      })

      return structuredCodes
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [])

  const getFavoriteCodes = useCallback(async (tokenIds) => {
    try {
      if (tokenIds.length === 0) return []
      const userCodes = await getFavoritesCodes(tokenIds)
      let structuredCodes = userCodes.map((code) => ({
        tokenId: code.tokenId,
        createdBy: code['1'],
        owner: code.owner
      })).filter(code => !BigNumber.from(0).eq(code.tokenId))

      structuredCodes = await Promise.all(structuredCodes.map(async (code) => {
        const uriURL = await getUriURL(code.tokenId)
        let likes = 0
        try {
          likes = await getLikes(code.tokenId)
          likes = likes.data
        } catch {
          likes = 0
        }
        if (!uriURL.includes('undefined')) {
          const { data: uri } = await getUri(uriURL)
          return { ...code, uri, likes }
        }
        return { ...code, likes }
      }))

      structuredCodes = structuredCodes.map(code => {
        return {
          id: code.tokenId,
          title: code.uri.name,
          description: code.uri.description,
          language: code.uri.attributes.language,
          image: code.uri.image,
          code: code.uri.code,
          owner: code.owner,
          tags: code.uri.attributes.tags.split(',').filter((tag) => tag !== ''),
          type: code.uri.attributes.type,
          ownerImage: API_URL + '/users/' + code.owner + '/image',
          likes: code.likes.liked
        }
      })

      return structuredCodes
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [])

  const createNft = useCallback(async (name, privated, number, language, description, tags, photo, link, file, type) => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')
      if (currentAccount === '') return window.alert('Please login')

      if (privated) {
        file = await encryptFile(file)
      }
      const { data: fileIPFS } = await uploadToIpfs(file)
      const { data: photoIPFS } = await uploadToIpfs(photo)

      const metadata = {
        name: name,
        description: description,
        image: ipfsURL + photoIPFS.Hash + '?filename=' + photoIPFS.Name,
        code: ipfsURL + fileIPFS.Hash + '?filename=' + fileIPFS.Name,
        attributes: {
          tags: tags.join(','),
          link: link,
          language: language,
          type: type
        }
      }
      const { data: metadataIPFS } = await uploadToIpfs(JSON.stringify(metadata))
      const metadataURL = ipfsURL + metadataIPFS.Hash + '?filename=' + metadataIPFS.Name

      const result = await createNFT(number, metadataURL, privated)
      return result
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [setCurrentAccout])

  const getCodeByTokenId = useCallback(async (tokenId) => {
    const userCode = await getCode(tokenId)
    let structuredCode = {
      tokenId: userCode.tokenId,
      createdBy: userCode['1'],
      owner: userCode.owner,
      isPrivate: userCode.isPrivate
    }

    const uriURL = await getUriURL(structuredCode.tokenId)
    let likes = 0
    try {
      likes = await getLikes(structuredCode.tokenId)
      likes = likes.data
    } catch {
      likes = 0
    }
    if (!uriURL.includes('undefined')) {
      const { data: uri } = await getUri(uriURL)
      structuredCode = { ...structuredCode, uri, likes }
    }
    structuredCode = { ...structuredCode, likes }

    const code = {
      id: structuredCode.tokenId,
      title: structuredCode.uri.name,
      description: structuredCode.uri.description,
      isPrivate: structuredCode.isPrivate,
      language: structuredCode.uri.attributes.language,
      image: structuredCode.uri.image,
      code: structuredCode.uri.code,
      owner: structuredCode.owner,
      tags: structuredCode.uri.attributes.tags.split(',').filter((tag) => tag !== ''),
      type: structuredCode.uri.attributes.type,
      ownerImage: API_URL + '/users/' + structuredCode.owner + '/image',
      likes: structuredCode.likes.liked
    }

    return code
  }, [setCurrentAccout])

  const uploadToIpfs = useCallback(async (file) => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')
      if (currentAccount === '') return window.alert('Please login')
      const result = await uploadFile(file)
      return result
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [setCurrentAccout])

  const getHistoryFromTokenId = useCallback(async (tokenId) => {
    try {
      const historyT = await getHistoryTransactions(tokenId)
      const info = await Promise.all(historyT.map(async (transaction) => {
        const block = await transaction.getBlock()
        const date = new Date(block.timestamp * 1000)
        const { data: userFrom } = transaction.args.from !== '0x0000000000000000000000000000000000000000' ? await getUser(transaction.args.from) : 'undefined'
        const { data: userTo } = await getUser(transaction.args.to)
        return {
          id: transaction.address,
          eventType: transaction.event,
          from: transaction.args.from,
          fromName: userFrom?.username,
          to: transaction.args.to,
          toName: userTo.username,
          date: date.toLocaleString(),
          hash: transaction.transactionHash
        }
      }))

      return info.reverse()
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [setCurrentAccout])

  const transferCode = useCallback(async (tokenId, to) => {
    try {
      if (!ethereum) return window.alert('Please install MetaMask')
      if (currentAccount === '') return window.alert('Please login')
      const result = await transfer(tokenId, to)
      return result
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [setCurrentAccout])

  const searchCodes = useCallback(async (search) => {
    try {
      // const userCodes = await searchCodes(search)
      const codes = await getAllCodes()
      let structuredCodes = codes.map((code) => ({
        tokenId: code.tokenId,
        createdBy: code['1'],
        owner: code.owner
      })).filter(code => !BigNumber.from(0).eq(code.tokenId))

      structuredCodes = await Promise.all(structuredCodes.map(async (code) => {
        const uriURL = await getUriURL(code.tokenId)
        if (!uriURL.includes('undefined')) {
          const { data: uri } = await getUri(uriURL)
          return { ...code, uri }
        }
        return code
      }))

      structuredCodes = structuredCodes.filter(code => {
        return code.uri.name.toLowerCase().includes(search.toLowerCase()) || code.uri.description.toLowerCase().includes(search.toLowerCase()) || code.uri.attributes.tags.toLowerCase().includes(search.toLowerCase())
      })

      structuredCodes = structuredCodes.map(code => {
        return {
          value: code.tokenId,
          label: code.uri.name,
          image: code.uri.image
        }
      })

      return structuredCodes
    } catch (error) {
      console.log({ error })
      throw new Error('No ethereum object found')
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentAccout('')
  }, [setCurrentAccout])

  return {
    currentAccount,
    login,
    logout,
    getCodes,
    getOwnerCodes,
    getCodesCreated,
    getFavoriteCodes,
    getCodeByTokenId,
    createNft,
    getHistoryFromTokenId,
    transferCode,
    searchCodes,
    isLogged: currentAccount !== ''
  }
}
