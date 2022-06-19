import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import History from './History'

describe('History', () => {
  test('renders content', () => {
    const component = render(
      <BrowserRouter>
        <History history={[]} />
      </BrowserRouter>
    )

    expect(component.getByText('Event')).toBeInTheDocument()
    expect(component.getByText('From')).toBeInTheDocument()
    expect(component.getByText('To')).toBeInTheDocument()
    expect(component.getByText('Date')).toBeInTheDocument()
  })

  test('shows one row of content', () => {
    const history = [
      {
        eventType: 'Minted',
        from: '0x0000000000000000000000000000000000000000',
        fromName: 'test1',
        to: '0x1234567890123456789012345678901234567890',
        toName: 'test2',
        date: '2020-01-01',
        hash: '0x9876543210123456789012345678901234567890'
      }
    ]

    const component = render(
      <BrowserRouter>
        <History history={history} />
      </BrowserRouter>
    )

    expect(component.getByText('Event')).toBeInTheDocument()
    expect(component.getByText('From')).toBeInTheDocument()
    expect(component.getByText('To')).toBeInTheDocument()
    expect(component.getByText('Date')).toBeInTheDocument()

    expect(component.getByText('Minted')).toBeInTheDocument()
    expect(component.getByText('test1')).toBeInTheDocument()
    expect(component.getByText('test2')).toBeInTheDocument()
    expect(component.getByText('2020-01-01')).toBeInTheDocument()

    const anchor = component.container.querySelector('a[target="_blank"]')
    expect(anchor).toHaveAttribute('href', 'https://rinkeby.etherscan.io/tx/0x9876543210123456789012345678901234567890')
  })

  test('shows two rows of content', () => {
    const history = [
      {
        eventType: 'Minted',
        from: '0x0000000000000000000000000000000000000000',
        fromName: 'test1',
        to: '0x1234567890123456789012345678901234567890',
        toName: 'test2',
        date: '2020-01-01',
        hash: '0x9876543210123456789012345678901234567890'
      },
      {
        eventType: 'Transfer',
        from: '0x1234567890123456789012345678901234567890',
        fromName: 'test2',
        to: '0x0000000000000000000000000000000000000000',
        toName: 'test1',
        date: '2020-01-02',
        hash: '0x9876543210123456789012345678901234567890'
      }
    ]

    const component = render(
      <BrowserRouter>
        <History history={history} />
      </BrowserRouter>
    )

    expect(component.getByText('Event')).toBeInTheDocument()
    expect(component.getByText('From')).toBeInTheDocument()
    expect(component.getByText('To')).toBeInTheDocument()
    expect(component.getByText('Date')).toBeInTheDocument()

    expect(component.getByText('Minted')).toBeInTheDocument()
    expect(component.getByText('Transfer')).toBeInTheDocument()
    expect(component.getAllByText('test1')).toHaveLength(2)
    expect(component.getAllByText('test2')).toHaveLength(2)
    expect(component.getByText('2020-01-01')).toBeInTheDocument()
  })
})
