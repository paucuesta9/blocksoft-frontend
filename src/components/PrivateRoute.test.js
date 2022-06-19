import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      isLogged: false
    }
  })
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
  useNavigate: () => ({
    navigate: jest.fn()
  }),
  Navigate: () => <div>Redirects</div>
}))

describe('PrivateRoute', () => {
  test('makes redirect', () => {
    const component = render(
      <BrowserRouter>
        <PrivateRoute>
          <div>Hello</div>
        </PrivateRoute>
      </BrowserRouter>
    )

    expect(component.queryByText('Redirects')).toBeInTheDocument()
  })
})
