import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import useUser from './useUser'
import { BigNumber } from 'ethers'

jest.mock('react', () => {
  const original = jest.requireActual('react')
  return {
    ...original,
    useState: jest.fn(),
    useEffect: jest.fn(),
    useContext: jest.fn(() => ({
      favs: [],
      jwt: 'froangotebg',
      userImage: '',
      hasGithubToken: false,
      setJWT: jest.fn(),
      setFavs: jest.fn(),
      setUserImage: jest.fn(),
      setHasGithubToken: jest.fn(),
      repositories: []
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

jest.mock('./useBlockchain', () => {
  return jest.fn(() => {
    return {
      isLogged: true,
      currentAccount: '0x1234567891234567890',
      login: jest.fn(() => Promise.resolve('0x1234567891234567890'))
    }
  })
})

jest.mock('../services/api/auth', () => ({
  authUser: jest.fn(() => Promise.resolve({
    data: {
      token: 'froangotebg',
      githubToken: true
    }
  })),
  fetchUser: jest.fn(() => Promise.resolve({
    data: {
      none: 'gqegehqhq5'
    }
  }))
}))

jest.mock('../services/api/likes', () => ({
  like: jest.fn(() => Promise.resolve({
    data: {
      token: 'froangotebg',
      githubToken: true
    },
    status: 201
  })),
  unlike: jest.fn(() => Promise.resolve({
    data: {
      none: 'gqegehqhq5'
    },
    status: 201
  }))
}))

jest.mock('../components/axios', () => {
  return {
    defaults: {
      headers: {
        common: {
          Authorization: 'Bearer froangotebg'
        }
      }
    }
  }
})

jest.mock('ethers', () => ({
  ethers: {
    providers: {
      Web3Provider: jest.fn((provider) => {
        return {
          getSigner: jest.fn(() => {
            return {
              signMessage: jest.fn(() => Promise.resolve('0x1234567891234567890'))
            }
          })
        }
      })
    }
  }
}))

jest.mock('../utils/getImageUserURL', (publicAddress) => `/users/${publicAddress}/image`)

describe('useUser', () => {
  test('logs in correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { signAndLogin } = useUser()

    const callback = jest.fn()

    const result = signAndLogin({ callback: callback })

    await new Promise(resolve => setTimeout(resolve, 1000))

    expect(callback).toHaveBeenCalled()
  })

  test('likes code correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { likeCode } = useUser()

    const result = await likeCode(1)

    expect(result).toBe(true)
  })

  test('unlikes code correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { unlikeCode } = useUser()

    const result = await unlikeCode(1)

    expect(result).toBe(false)
  })

  test('log outs correctly', async () => {
    window.ethereum = {
      enable: jest.fn(() => Promise.resolve()),
      request: jest.fn(({ method }) => Promise.reject())
    }

    window.sessionStorage.setItem('jwt', 'froangotebg')

    expect(window.sessionStorage.getItem('jwt')).toBe('froangotebg')

    Object.defineProperty(window, 'alert', {
      value: jest.fn()
    })

    const { logout } = useUser()

    logout()

    expect(window.sessionStorage.getItem('jwt')).toBe(null)
  })
})
