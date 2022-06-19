import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Search from './Search'

jest.mock('../services/api/user', () => {
  return {
    searchUsers: jest.fn(() => Promise.resolve({ data: [{ label: 'testUser', value: 'test', iamge: 'img' }] }))
  }
})

jest.mock('../hooks/useBlockchain', () => () => {
  return {
    useBlockchain: jest.fn(() => ({
      searchCodes: jest.fn(() => Promise.resolve({ data: { label: 'testCode', value: 'test', image: 'img' } }))
    }))
  }
})

jest.mock('../utils/getImageUserURL', () => {
  return {
    getImageUserURL: jest.fn(() => Promise.resolve('test'))
  }
})

jest.mock('../img/code-placeholder.png', () => {
  return ''
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

describe('Search', () => {
  test('renders content', () => {
    const label = 'Select'
    const value = 0

    const component = render(<Search />)

    const inputElement = component.container.querySelector('input')
    expect(inputElement).toBeInTheDocument()

    expect(inputElement).toHaveAttribute('placeholder', 'Search for code, accounts and toppics')
  })

  test('on type, select is opened', () => {
    const label = 'Select'
    const value = 0

    const component = render(<Search />)

    const inputElement = component.container.querySelector('input')
    fireEvent.change(inputElement, { target: { value: 'test' } })

    expect(component.container).toHaveTextContent('Accounts')
    expect(component.container).toHaveTextContent('Codes')
  })

  test('on type, select is opened and get content', () => {
    const component = render(<Search />)

    const inputElement = component.container.querySelector('input')
    fireEvent.change(inputElement, { target: { value: 'test' } })

    // wait 3 seconds
    setTimeout(() => {
      expect(component.container).toHaveTextContent('testUser')
      expect(component.container).toHaveTextContent('testCode')
    }, 2000)
  })
})
