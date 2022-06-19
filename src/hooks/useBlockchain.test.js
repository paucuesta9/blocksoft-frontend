import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import useBlockchain from './useBlockchain'
import { BigNumber } from 'ethers'

jest.mock('react', () => {
  const original = jest.requireActual('react')
  return {
    ...original,
    useState: jest.fn(),
    useEffect: jest.fn(),
    useContext: jest.fn(() => ({
      currentAccount: '0x1234567891234567890',
      setCurrentAccout: jest.fn(),
      setCodes: jest.fn()
    })),
    useCallback: jest.fn((fn, array) => fn)
  }
})

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path'
  }),
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: () => ({
    id: 'test'
  }),
  useSearchParams: () => ({
    get: jest.fn()
  }),
  useNavigate: () => {
    return jest.fn((to, config) => {
      return 'error'
    })
  }
}))

jest.mock('../services/api/user', () => ({
  getUser: jest.fn((address) => Promise.resolve({
    data: {
      address,
      username: 'test'
    }
  }))
}))

jest.mock('../services/api/likes', () => ({
  getLikes: jest.fn(() => {
    return {
      data: {
        liked: 1
      }
    }
  })
}))

jest.mock('../utils/encrypt', () => ({
  encryptFile: jest.fn((file) => Promise.resolve(file))
}))

jest.mock('../services/blockchain/ipfs', () => ({
  uploadFile: jest.fn((file) => Promise.resolve({
    data: {
      Hash: '0x1234567891234567890',
      Name: 'test.txt'
    }
  }))
}))

jest.mock('../services/blockchain/codes', () => ({
  getAllCodes: jest.fn(() => Promise.resolve([{
    tokenId: 1,
    1: '0x1234567891234567890',
    owner: '0x1234567891234567890'
  }])),
  createNFT: jest.fn((number, metadata, privated) => Promise.resolve({
    chainId: 1,
    transactionHash: '0x1234567891234567890'
  })),
  getUriURL: jest.fn((tokenId) => 'https://ipfs.io/ipfs/' + tokenId),
  getUri: jest.fn(() => ({
    data: {
      name: 'Token 1',
      description: 'Description 1',
      image: 'https://example.com/image.png',
      code: 'https://example.com/code.js',
      attributes: {
        language: 'javascript',
        tags: 'tag1,tag2',
        type: 'code'
      }
    }
  })),
  getUserOwnerCodes: jest.fn(() => Promise.resolve([{
    tokenId: 1,
    1: '0x1234567891234567890',
    owner: '0x1234567891234567890'
  }])),
  getCodesCreatedByUser: jest.fn(() => Promise.resolve([{
    tokenId: 1,
    1: '0x1234567891234567890',
    owner: '0x1234567891234567890'
  }])),
  getFavoritesCodes: jest.fn((tokenIds) => {
    const { BigNumber: big } = require('ethers')
    return Promise.resolve([{
      tokenId: big.from(1),
      1: '0x1234567891234567890',
      owner: '0x1234567891234567890'
    }])
  }),
  getCode: jest.fn((tokenId) => Promise.resolve({
    tokenId: 1,
    1: '0x1234567891234567890',
    owner: '0x123456789123456790',
    isPrivate: tokenId !== 1
  })),
  getHistoryTransactions: jest.fn((tokenId) => {
    return Promise.resolve([{
      chainId: 1,
      transactionHash: '0x1234567891234567890',
      args: {
        from: '0x1234567891234567890',
        to: '0x1234567891234567890'
      },
      event: 'Transfer',
      address: '0x1234567891234567890',
      getBlock: jest.fn(() => ({
        timestamp: '1655324436',
        transactionHash: '0x1234567891234567890'
      }))
    }])
  }),
  transfer: jest.fn(() => Promise.resolve({
    chainId: 1,
    transactionHash: '0x1234567891234567890'
  }))
}))

describe('useBlockchain', () => {
  test('logs in correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.resolve(['0x1234567891234567890']))
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { login } = useBlockchain()

    const result = await login()

    expect(result).toBe('0x1234567891234567890')
  })

  test('logs in badly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { login } = useBlockchain()

    await expect(login()).rejects.toThrow()
  })

  test('getCodes correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getCodes } = useBlockchain()

    const result = await getCodes()

    expect(result).toEqual([{
      id: 1,
      title: 'Token 1',
      description: 'Description 1',
      language: 'javascript',
      image: 'https://example.com/image.png',
      code: 'https://example.com/code.js',
      owner: '0x1234567891234567890',
      tags: ['tag1', 'tag2'],
      type: 'code',
      ownerImage: 'test_url/users/0x1234567891234567890/image',
      likes: 1
    }])
  })

  test('getOwnerCodes correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getOwnerCodes } = useBlockchain()

    const result = await getOwnerCodes()

    expect(result).toEqual([{
      id: 1,
      title: 'Token 1',
      description: 'Description 1',
      language: 'javascript',
      image: 'https://example.com/image.png',
      code: 'https://example.com/code.js',
      owner: '0x1234567891234567890',
      tags: ['tag1', 'tag2'],
      type: 'code',
      ownerImage: 'test_url/users/0x1234567891234567890/image',
      likes: 1
    }])
  })

  test('getCodesCreated correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getCodesCreated } = useBlockchain()

    const result = await getCodesCreated()

    expect(result).toEqual([{
      id: 1,
      title: 'Token 1',
      description: 'Description 1',
      language: 'javascript',
      image: 'https://example.com/image.png',
      code: 'https://example.com/code.js',
      owner: '0x1234567891234567890',
      tags: ['tag1', 'tag2'],
      type: 'code',
      ownerImage: 'test_url/users/0x1234567891234567890/image',
      likes: 1
    }])
  })

  test('getFavoritedCodes correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getFavoriteCodes } = useBlockchain()

    const result = await getFavoriteCodes([1])

    expect(result).toEqual([{
      id: BigNumber.from(1),
      title: 'Token 1',
      description: 'Description 1',
      language: 'javascript',
      image: 'https://example.com/image.png',
      code: 'https://example.com/code.js',
      owner: '0x1234567891234567890',
      tags: ['tag1', 'tag2'],
      type: 'code',
      ownerImage: 'test_url/users/0x1234567891234567890/image',
      likes: 1
    }])
  })

  test('createsNft correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { createNft } = useBlockchain()

    const result = await createNft('Token 1', true, 1, 'javascript', 'Description 1', ['tag1', 'tag2'], 'photo', 'https://example.com/code.js', 'file', 'code')

    expect(result).toEqual({
      chainId: 1,
      transactionHash: '0x1234567891234567890'
    })
  })

  test('getTokenById correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getCodeByTokenId } = useBlockchain()

    const result = await getCodeByTokenId(1)

    expect(result).toEqual({
      id: 1,
      title: 'Token 1',
      description: 'Description 1',
      language: 'javascript',
      image: 'https://example.com/image.png',
      code: 'https://example.com/code.js',
      owner: '0x123456789123456790',
      tags: ['tag1', 'tag2'],
      type: 'code',
      ownerImage: 'test_url/users/0x123456789123456790/image',
      likes: 1
    })
  })

  test('getTokenById is private and user is not owner', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getCodeByTokenId } = useBlockchain()

    await expect(getCodeByTokenId(2)).rejects.toThrow()
  })

  test('getHistoryFromTokenId correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { getHistoryFromTokenId } = useBlockchain()

    const result = await getHistoryFromTokenId(1)

    expect(result).toEqual([{
      id: '0x1234567891234567890',
      eventType: 'Transfer',
      from: '0x1234567891234567890',
      fromName: 'test',
      to: '0x1234567891234567890',
      toName: 'test',
      date: new Date(1655324436 * 1000).toLocaleString(),
      hash: '0x1234567891234567890'
    }])
  })

  test('transfers code correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { transferCode } = useBlockchain()

    const result = await transferCode(1, '0x1234567891234567890')

    expect(result).toEqual({
      chainId: 1,
      transactionHash: '0x1234567891234567890'
    })
  })

  test('searches code find result', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { searchCodes } = useBlockchain()

    const result = await searchCodes('Token 1')

    expect(result).toEqual([{
      value: 1,
      label: 'Token 1',
      image: 'https://example.com/image.png'
    }])
  })

  test('searches code not find any result', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { searchCodes } = useBlockchain()

    const result = await searchCodes('test')

    expect(result).toEqual([])
  })

  test('log out correctly', () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { logout } = useBlockchain()

    expect(logout()).toBeUndefined()
  })
})
