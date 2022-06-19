import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Avatar from './Avatar'

describe('Avatar', () => {
  test('renders content', () => {
    const component = render(<Avatar src='test' />)

    const img = component.container.querySelector('img')
    expect(img).toHaveAttribute('src', 'test')
  })

  test('when clicked on image, handles trigger', () => {
    const onClick = jest.fn()
    const component = render(<Avatar src='test' handleClick={onClick} />)

    const img = component.container.querySelector('img')
    fireEvent.click(img)

    expect(onClick).toHaveBeenCalled()
  })
})
