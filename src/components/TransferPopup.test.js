import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import TransferPopup from './TransferPopup'

jest.mock('../hooks/useBlockchain', () => {
  return jest.fn(() => {
    return {
      transferCode: jest.fn()
    }
  })
})

jest.mock('../services/api/user', () => {
  return {
    searchUsers: jest.fn(() => Promise.resolve([]))
  }
})

jest.mock('../components/SimpleComponents', () => ({
  Button: jest.fn(() => {
    return <div>SimpleComponent</div>
  })
}))

jest.mock('../components/Select', () => {
  return jest.fn(() => {
    return <div>Select</div>
  })
})

describe('TransferPopup', () => {
  test('renders content', () => {
    const setShowTransferPopup = jest.fn()
    const tokenId = 1
    const setLoading = jest.fn()

    const component = render(<TransferPopup setShowTransferPopup={setShowTransferPopup} tokenId={tokenId} setLoading={setLoading} />)

    expect(component.getByText('Select or type address of user to send')).toBeInTheDocument()
  })
})
