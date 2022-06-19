import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Footer from './Footer'

describe('Footer', () => {
  test('renders content', () => {
    const component = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(component.getByText('Home')).toBeInTheDocument()
    expect(component.getByText('Create')).toBeInTheDocument()
    expect(component.getByText('Explore')).toBeInTheDocument()
    expect(component.getByText('My account')).toBeInTheDocument()
  })
})
