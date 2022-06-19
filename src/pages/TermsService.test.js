import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import TermsService from './TermsService'

describe('TermsService', () => {
  test('renders content', () => {
    const component = render(
      <TermsService />
    )

    expect(component.getByText('Terms of Service')).toBeInTheDocument()
  })
})
