import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import PrivateRoute from './PrivateRoute'

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      isLogged: true
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
  })
}))

describe('PrivateRoute', () => {
  test('shows content', () => {
    const component = render(<PrivateRoute>
      <div>Hello</div>
    </PrivateRoute>)

    expect(component.queryByText('Hello')).toBeInTheDocument()
  })
})
