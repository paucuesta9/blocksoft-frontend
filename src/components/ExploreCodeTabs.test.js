import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ExploreCodeTabs from './ExploreCodeTabs'

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      getCodes: jest.fn(() => {
        return [
          {
            id: 'test',
            name: 'test',
            description: 'test',
            code: 'test',
            language: 'test',
            owner: 'test',
            createdAt: 'test',
            updatedAt: 'test'
          },
          {
            id: 'test',
            name: 'test',
            description: 'test',
            code: 'test',
            language: 'test',
            owner: 'test',
            createdAt: 'test',
            updatedAt: 'test'
          },
          {
            id: 'test',
            name: 'test',
            description: 'test',
            code: 'test',
            language: 'test',
            owner: 'test',
            createdAt: 'test',
            updatedAt: 'test'
          }
        ]
      })
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

describe('ExploreCodeTabs', () => {
  test('renders content', () => {
    const component = render(
      <ExploreCodeTabs />
    )

    expect(component.getByText('Newest')).toBeInTheDocument()
    expect(component.getByText('Top Views')).toBeInTheDocument()
    expect(component.getByText('Top Rated')).toBeInTheDocument()
    expect(component.getByText('Javascript')).toBeInTheDocument()
    expect(component.getByText('Java')).toBeInTheDocument()
    expect(component.getByText('Kotlin')).toBeInTheDocument()
    expect(component.getByText('Python')).toBeInTheDocument()
    expect(component.getByText('Ruby')).toBeInTheDocument()
    expect(component.getByText('Solidity')).toBeInTheDocument()
    expect(component.getByText('.NET')).toBeInTheDocument()
  })

  test('renders newest tab by default', () => {
    const component = render(
      <ExploreCodeTabs />
    )

    const selectedTab = component.container.querySelector('.tab_active')

    expect(selectedTab.textContent).toBe('Newest')
  })

  test('renders the tab sended by param', () => {
    const selectedTab = 'javascript'

    const component = render(
      <ExploreCodeTabs selectedTab={selectedTab} />
    )

    const tab = component.container.querySelector('.tab_active')

    expect(tab.textContent).toBe('Javascript')
  })
})
