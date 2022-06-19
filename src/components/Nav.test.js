import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Nav from './Nav'

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      isLogged: false,
      signAndLogin: jest.fn()
    }
  })
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
  useParams: () => ({
    id: 'test'
  }),
  useSearchParams: () => ({
    get: jest.fn()
  }),
  useNavigate: () => ({
    navigate: jest.fn()
  }),
  Navigate: () => <div>Redirects</div>
}))

jest.mock('./NavAvatar', () => {
  return jest.fn(() => {
    return <div>NavAvatar</div>
  })
})

jest.mock('./Search', () => {
  return jest.fn(() => {
    return <div>Search</div>
  })
})

describe('Nav', () => {
  test('renders content', () => {
    const component = render(<BrowserRouter>
      <Nav />
                             </BrowserRouter>)

    expect(component.getByText('Explore')).toBeInTheDocument()
    expect(component.getByText('Create')).toBeInTheDocument()
  })
})
