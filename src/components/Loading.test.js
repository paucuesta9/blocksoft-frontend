import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Loading from './Loading'

jest.mock('@lottiefiles/react-lottie-player', () => {
  return {
    Lottie: () => <div>Lottie</div>,
    Player: () => <div>Player</div>
  }
})

describe('Loading', () => {
  test('renders content', () => {
    const component = render(<Loading />)

    expect(component.getByText('Loading...')).toBeInTheDocument()
  })

  test('shows text', () => {
    const message = 'Test message...'

    const component = render(<Loading message={message} />)

    expect(component.getByText(message)).toBeInTheDocument()
  })
})
