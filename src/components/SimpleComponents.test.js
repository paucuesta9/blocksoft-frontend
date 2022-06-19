import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import { Button } from './SimpleComponents'

describe('Simple Components', () => {
  test('renders content', () => {
    const text = 'Click'

    const component = render(<Button>{text}</Button>)

    expect(component.container).toHaveTextContent(text)
  })

  test('clicking the button calls event handler once', () => {
    const text = 'Click'

    const click = jest.fn()

    const component = render(<Button click={click}>{text}</Button>)

    component.getByText(text).click()

    expect(click).toHaveBeenCalledTimes(1)
  })
})
