import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import LoginPopup from './LoginPopup'

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      login: jest.fn()
    }
  })
})

describe('LoginPopup', () => {
  test('renders content', () => {
    const component = render(<LoginPopup />)

    expect(component.getByText('Connect your Metamask wallet to use the APP')).toBeInTheDocument()
  })
})
