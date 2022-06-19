import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import NavAvatar from './NavAvatar'

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      currentAccount: '0x1234567890123456789012345678901234567890',
      login: jest.fn()
    }
  })
})

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      userImage: 'test',
      isLogged: false,
      signAndLogin: jest.fn(),
      logout: jest.fn()
    }
  })
})

describe('NavAvatar', () => {
  test('renders content', () => {
    const component = render(<BrowserRouter>
      <NavAvatar />
    </BrowserRouter>)

    expect(component.getByAltText('avatar')).toBeInTheDocument()
  })

  test('on image click, should handle trigger', () => {
    const component = render(<BrowserRouter>
      <NavAvatar />
    </BrowserRouter>)

    const image = component.getByAltText('avatar')
    fireEvent.click(image)

    expect(component.getByText('Profile')).toBeInTheDocument()
    expect(component.getByText('My Apps')).toBeInTheDocument()
    expect(component.getByText('Favorites')).toBeInTheDocument()
    expect(component.getByText('Settings')).toBeInTheDocument()
    expect(component.getByText('Log out')).toBeInTheDocument()
  })
})
