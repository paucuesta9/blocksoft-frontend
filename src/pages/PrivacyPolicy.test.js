import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import PrivacyPolicy from './PrivacyPolicy'

describe('PrivacyPolicy', () => {
  test('renders content', () => {
    const component = render(
      <PrivacyPolicy />
    )

    expect(component.getByText('Privacy policy')).toBeInTheDocument()
  })
})
