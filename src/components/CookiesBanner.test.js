import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import CookiesBanner from './CookiesBanner'

describe('CookiesBanner', () => {
  test('renders content', () => {
    document.cookie = '; expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    const component = render(
      <BrowserRouter>
        <CookiesBanner />
      </BrowserRouter>
    )

    expect(component.getByText('This website uses cookies to ensure you get the best experience on our website.')).toBeInTheDocument()
  })

  test('cookies are accepted', () => {
    document.cookie = 'cookies_accepted=true'

    const component = render(
      <BrowserRouter>
        <CookiesBanner />
      </BrowserRouter>
    )

    expect(component.queryByText('This website uses cookies to ensure you get the best experience on our website.')).toBeNull()
  })

  test('accepts and banner dissapears', () => {
    const cookies = document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }

    const component = render(
      <BrowserRouter>
        <CookiesBanner />
      </BrowserRouter>
    )

    expect(component.queryByText('This website uses cookies to ensure you get the best experience on our website.')).toBeInTheDocument()

    const acceptButton = component.getByText('Accept')
    fireEvent.click(acceptButton)

    expect(component.queryByText('This website uses cookies to ensure you get the best experience on our website.')).toBeNull()
  })
})
