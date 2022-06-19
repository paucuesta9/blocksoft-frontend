import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Address from './Address'

describe('Address', () => {
  test('renders content', () => {
    const address = '0x1234567890123456789012345678901234567890'

    const component = render(<Address address={address} />)

    expect(component.container).toHaveTextContent('0x123...7890')
  })

  test('clicking the button, shows popup', async () => {
    const address = '0x1234567890123456789012345678901234567890'

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: () => {}
      }
    })

    const component = render(<Address address={address} />)

    fireEvent.click(component.container.querySelector('div'))

    const popup = component.container.querySelector('p')
    expect(popup).toHaveTextContent('Copied!')
  })
})
