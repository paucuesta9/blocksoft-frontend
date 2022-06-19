import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import PopupError from './PopupError'

describe('PopupError', () => {
  test('renders content', () => {
    const component = render(<PopupError />)

    expect(component.getByText('Accept')).toBeInTheDocument()
  })

  test('message is shown', () => {
    const errorMessage = 'Error message'

    const component = render(<PopupError message={errorMessage} />)

    expect(component.getByText(errorMessage)).toBeInTheDocument()
  })

  test('on accept, handles click', () => {
    const setShowPopup = jest.fn()

    const component = render(<PopupError setShowPopup={setShowPopup} />)

    fireEvent.click(component.getByText('Accept'))

    expect(setShowPopup).toHaveBeenCalled()
  })
})
