import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import InputFiles from './InputFiles'
import { Button } from '@nextui-org/react'

describe('InputFiles', () => {
  test('renders content', () => {
    const value = []
    const setValue = jest.fn()

    const component = render(<InputFiles value={value} setValue={setValue} />)

    expect(component.getByText('Click or drag your code here...')).toBeInTheDocument()
  })

  test('file is added', () => {
    const value = []
    const setValue = jest.fn()

    const component = render(<InputFiles value={value} setValue={setValue} />)

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    const fileList = [file]
    const mockEvent = {
      target: {
        files: fileList
      }
    }

    fireEvent.change(component.container.querySelector('input'), mockEvent)

    expect(setValue).toHaveBeenCalledWith(fileList)
  })
})
