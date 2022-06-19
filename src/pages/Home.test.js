import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Home from './Home'
import { CodeSection } from '../components/Codes'

jest.mock('react', () => {
  const original = jest.requireActual('react')
  return {
    ...original,
    useState: jest.fn((initialValue) => [initialValue, jest.fn()]),
    useEffect: jest.fn(),
    useContext: jest.fn(() => ({
      repositories: [],
      setRepositories: jest.fn(),
      hasGithubToken: false,
      setHasGithubToken: jest.fn()
    })),
    useCallback: jest.fn((fn, array) => fn),
    useRef: jest.fn(() => ({
      current: null
    }))
  }
})

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
    location: {
      pathname: 'localhost:3000/example/path',
      search: '?query=string'
    }
  }),
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: jest.fn(() => ({
    tab: 'javascript'
  })),
  useSearchParams: () => ({
    get: jest.fn()
  }),
  useNavigate: () => {
    return jest.fn((to, config) => {
      return 'error'
    })
  },
  Link: jest.fn(() => <div>Link</div>)
}))

jest.mock('../components/LoginPopUp', () => {
  return jest.fn(() => {
    return <div>LoginPopUp</div>
  })
})

jest.mock('../components/PopupError', () => {
  return jest.fn(() => {
    return <div>PopupError</div>
  })
})

jest.mock('../components/SimpleComponents', () => ({
  Button: jest.fn(() => {
    return <div>SimpleComponent</div>
  })
}))

jest.mock('../components/Codes', () => ({
  CodeSection: jest.fn(() => {
    return <div>CodeSection</div>
  })
}))

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      currentAccount: '0x1234567890123456789012345678901234567890',
      getFavoriteCodes: jest.fn(),
      getCodes: jest.fn()
    }
  })
})

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      isLogged: true,
      signAndLogin: jest.fn()
    }
  })
})

jest.mock('../services/api/codes', () => {
  return {
    getMostViewed: jest.fn(() => Promise.resolve([])),
    getMostRated: jest.fn(() => Promise.resolve([]))
  }
})

describe('Home', () => {
  test('renders content', () => {
    const component = render(
      <Home />
    )

    expect(component.getByText('Blocksoft')).toBeInTheDocument()
    expect(component.getByText('Your blockchain code manager')).toBeInTheDocument()
  })
})
