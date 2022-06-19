import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Header from './Header'

jest.mock('../components/Search', () => {
  return jest.fn(() => {
    return <div>Search</div>
  })
})

jest.mock('../components/Nav', () => {
  return jest.fn(() => {
    return <div>Nav</div>
  })
})

describe('Header', () => {
  test('renders content', () => {
    const component = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(component.getByText('Blocksoft')).toBeInTheDocument()
  })
})
