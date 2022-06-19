import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import CookiesPolicy from './CookiesPolicy'

describe('CookiesPolicy', () => {
  test('renders content', () => {
    const component = render(
      <CookiesPolicy />
    )

    expect(component.getByText('Cookies Policy')).toBeInTheDocument()
  })
})
