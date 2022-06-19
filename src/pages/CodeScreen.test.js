import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import CodeScreen from './CodeScreen'

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
    location: {
      pathname: 'localhost:3000/example/path',
      search: '?query=string'
    }
  }),
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: jest.fn(() => ({
    tokenId: 1
  })),
  useSearchParams: () => ({
    get: jest.fn()
  }),
  useNavigate: () => {
    return jest.fn((to, config) => {
      return 'navigate'
    })
  }
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: jest.fn(({ children }) => <div>{children}</div>)
}))

jest.mock('../components/Address', () => {
  return jest.fn(() => {
    return <div>Address</div>
  })
})

jest.mock('../components/Avatar', () => {
  return jest.fn(() => {
    return <div>Avatar</div>
  })
})

jest.mock('../components/CodeBox', () => {
  return jest.fn(() => {
    return <div>CodeBox</div>
  })
})

jest.mock('../components/History', () => {
  return jest.fn(() => {
    return <div>History</div>
  })
})

jest.mock('../components/Loading', () => {
  return jest.fn(() => {
    return <div>Loading</div>
  })
})

jest.mock('../components/Tag', () => {
  return jest.fn(() => {
    return <div>Tag</div>
  })
})

jest.mock('../components/TransferPopup', () => {
  return jest.fn(() => {
    return <div>TransferPopup</div>
  })
})

jest.mock('../services/api/github', () => {
  return {
    auth: jest.fn(() => Promise.resolve({})),
    createRepository: jest.fn(() => Promise.resolve({}))
  }
})

jest.mock('../services/api/user', () => {
  return {
    getUser: jest.fn(() => Promise.resolve({}))
  }
})

jest.mock('../services/api/codes', () => {
  return {
    codeViewed: jest.fn(() => Promise.resolve({}))
  }
})

jest.mock('../utils/encrypt', () => {
  return {
    decryptFile: jest.fn(() => Promise.resolve({}))
  }
})

jest.mock('../utils/getImageUserURL', () => {
  return jest.fn(() => 'imageURL')
})

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      currentAccount: '0x123456789',
      getCodeByTokenId: jest.fn(() => Promise.resolve({})),
      getHistoryFromTokenId: jest.fn(() => Promise.resolve({}))
    }
  })
})

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      isLogged: false,
      hasGithubToken: false,
      setHasGithubToken: jest.fn(),
      signAndLogin: jest.fn()
    }
  })
})

jest.mock('jszip', () => {
  return {
    JSZip: jest.fn(() => {
      return {
        file: jest.fn(),
        loadAsync: jest.fn(() => Promise.resolve({})),
        generateAsync: jest.fn(() => Promise.resolve({}))
      }
    })
  }
})

describe('CodeScreen', () => {
  test('renders content', () => {
    const component = render(
      <CodeScreen />
    )

    expect(component.getByText('undefined')).toBeInTheDocument()
  })
})
