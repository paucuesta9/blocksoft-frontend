import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { CodeSection, CodeItem } from './Codes'

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      likeCode: jest.fn(),
      unlikeCode: jest.fn(),
      isLogged: true,
      signAndLogin: jest.fn(),
      favs: []
    }
  })
})

jest.mock('./Loading', () => {
  return jest.fn(() => {
    return <div>Loading</div>
  })
})

jest.mock('../styles/CodesTabs.module.css', () => ({
  tabs_content_item_info_heart: 'like_div'
}))

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

describe('CodeItem', () => {
  test('renders content', () => {
    const code = {
      id: 1,
      title: 'Code test'
    }

    const component = render(
      <BrowserRouter>
        <CodeItem code={code} />
      </BrowserRouter>
    )

    expect(component.getByText('Code test')).toBeInTheDocument()
  })
})

describe('CodeSection', () => {
  test('renders content', () => {
    const codes = []

    const component = render(
      <CodeSection codes={codes} />
    )

    expect(component.getByText('No codes found')).toBeInTheDocument()
  })

  test('shows code info', () => {
    const codes = [{
      id: 1
    }]

    const component = render(
      <BrowserRouter>
        <CodeSection codes={codes} />
      </BrowserRouter>
    )

    expect(component.queryByText('No codes found')).toBeNull()
  })
})
