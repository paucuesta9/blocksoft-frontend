import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import Tag from './Tag'

describe('Tag', () => {
  test('renders content', () => {
    const tag = 'tag'

    const component = render(<Tag tag={tag} />)

    expect(component.container).toHaveTextContent(tag)
  })

  test('button delete is not showing', () => {
    const tag = 'tag'

    const component = render(<Tag tag={tag} />)

    expect(component.container.querySelector('span span')).toBeNull()
  })

  test('button delete is showing', () => {
    const tag = 'tag'

    const component = render(<Tag tag={tag} index={1} />)

    expect(component.container.querySelector('span span')).toBeInTheDocument()
  })

  test('clicking the button calls event handler once', () => {
    const tag = 'tag'

    const removeTag = jest.fn()

    const component = render(<Tag tag={tag} removeTag={removeTag} index={1} />)

    component.container.querySelector('span span').click()

    expect(removeTag).toHaveBeenCalledTimes(1)
  })
})
