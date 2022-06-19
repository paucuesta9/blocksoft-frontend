import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import CodeForm from './CodeForm'

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

jest.mock('../components/SimpleComponents', () => ({
  Button: jest.fn(() => {
    return <div>SimpleComponent</div>
  })
}))

jest.mock('../components/InputFiles', () => {
  return jest.fn(() => {
    return <div>InputFiles</div>
  })
})

jest.mock('../components/Select', () => {
  return jest.fn(() => {
    return <div>Select</div>
  })
})

jest.mock('../components/PopupSelectRepo', () => {
  return jest.fn(() => {
    return <div>PopupSelectRepo</div>
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

jest.mock('../services/api/github', () => {
  return {
    auth: jest.fn(() => Promise.resolve({})),
    getRepositories: jest.fn(() => Promise.resolve({})),
    getRepositoryFiles: jest.fn(() => Promise.resolve({}))
  }
})

jest.mock('../services/api/languages', () => {
  return {
    getLanguages: jest.fn(() => Promise.resolve({}))
  }
})

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      createNft: jest.fn(() => Promise.resolve('0x1234567891234567890'))
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

describe('CodeForm', () => {
  test('renders content', () => {
    const component = render(<CodeForm />)

    expect(component.getByText('Upload new item')).toBeInTheDocument()
  })
})
