import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import PopupSelectRepo from './PopupSelectRepo'

jest.mock('../hooks/useUser', () => {
  return jest.fn(() => {
    return {
      repositories: {
        items: [
          {
            id: '1',
            name: 'Repo 1'
          },
          {
            id: '2',
            name: 'Repo 2'
          }
        ]
      },
      loading: false
    }
  })
})

describe('PopupSelectRepo', () => {
  test('renders content', () => {
    const selectedRepository = {
      value: '1',
      label: 'Repo 1'
    }

    const setSelectedRepository = jest.fn()

    const component = render(<PopupSelectRepo selectedRepository={selectedRepository} setSelectedRepository={setSelectedRepository} />)

    expect(component.getByText('Repo 1')).toBeInTheDocument()
  })

  test('on accept, handles click', () => {
    const selectedRepository = {
      value: '1',
      label: 'Repo 1'
    }

    const setSelectedRepository = jest.fn()

    const setShowRepoPopup = jest.fn()

    const component = render(<PopupSelectRepo selectedRepository={selectedRepository} setSelectedRepository={setSelectedRepository} setShowRepoPopup={setShowRepoPopup} />)

    fireEvent.click(component.getByText('Accept'))

    expect(setShowRepoPopup).toHaveBeenCalled()
  })

  test('on cancel, handles click', () => {
    const selectedRepository = {
      value: '1',
      label: 'Repo 1'
    }

    const setSelectedRepository = jest.fn()

    const setShowRepoPopup = jest.fn()

    const component = render(<PopupSelectRepo selectedRepository={selectedRepository} setSelectedRepository={setSelectedRepository} setShowRepoPopup={setShowRepoPopup} />)

    fireEvent.click(component.getByText('Cancel'))

    expect(setShowRepoPopup).toHaveBeenCalled()
  })
})
