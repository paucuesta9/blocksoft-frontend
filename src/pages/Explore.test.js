import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Explore from './Explore'

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

jest.mock('../components/ExploreCodeTabs', () => {
  return jest.fn(() => {
    return <div>ExploreCodeTabs</div>
  })
})

describe('Explore', () => {
  test('renders content', () => {
    const component = render(
      <Explore />
    )

    expect(component.getByText('Explore')).toBeInTheDocument()
  })
})
