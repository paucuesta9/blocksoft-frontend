import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import CodesTabs from './CodesTabs'

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      currentAccount: '0x1234567891234567891234567890'
    }
  })
})

jest.mock('./Loading', () => {
  return jest.fn(() => {
    return <div>Loading</div>
  })
})

jest.mock('./Codes', () => ({
  CodeSection: jest.fn(() => {
    return <div>CodeSection</div>
  })
}))

jest.mock('../services/api/codes', () => {
  return {
    getMostViewed: jest.fn(() => {
      return {
        data: [
          {
            token_id: 'test'
          },
          {
            token_id: 'test'
          }
        ]
      }
    }
    )
  }
})

jest.mock('../styles/CodesTabs.module.css', () => ({
  tab_active: 'tab_active'
}))

describe('CodesTabs', () => {
  test('renders content', () => {
    const user = {}

    const component = render(
      <BrowserRouter>
        <CodesTabs user={user} />
      </BrowserRouter>
    )

    expect(component.getByText('Created')).toBeInTheDocument()
    expect(component.getByText('Favorited')).toBeInTheDocument()
  })

  test('is user account, show its apps and codes', () => {
    const user = {
      publicAddress: '0x1234567891234567891234567890'
    }

    const component = render(
      <BrowserRouter>
        <CodesTabs user={user} />
      </BrowserRouter>
    )

    expect(component.getByText('My codes')).toBeInTheDocument()
    expect(component.getByText('My apps')).toBeInTheDocument()
  })

  test('is not user account, show its apps and codes', () => {
    const user = {
      publicAddress: '0x1234567891234567891234567890'
    }

    const component = render(
      <BrowserRouter>
        <CodesTabs user={user} />
      </BrowserRouter>
    )

    expect(component.getByText('My codes')).toBeInTheDocument()
    expect(component.getByText('My apps')).toBeInTheDocument()
  })
})
