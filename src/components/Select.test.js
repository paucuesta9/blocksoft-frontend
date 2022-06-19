import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'

import Select from './Select'

//  Select = ({ options, setValue, value, type = 'label', maxWidth, admitTypedValue, handleInputChanged })

describe('Select', () => {
  test('renders content', () => {
    const label = 'Select'
    const value = 0

    const component = render(<Select value={{ label: label, value: value }} />)

    expect(component.container).toHaveTextContent(label)
  })

  test('if value has image, shows it', () => {
    const label = 'Select'
    const value = 0

    const component = render(<Select value={{ label: label, value: value, image: 'g' }} />)

    const labelElement = component.getByText(label)
    expect(labelElement.querySelector('img')).toHaveAttribute('src', 'g')
  })

  test('if not said, label as default', () => {
    const label = 'Select'
    const value = 0

    const component = render(<Select value={{ label: label, value: value }} />)

    const labelElement = component.getByText(label)
    expect(labelElement.tagName).toBe('DIV')
  })

  test('select is an input autocomplete', () => {
    const label = 'Select'
    const value = 0

    const component = render(<Select value={{ label: label, value: value }} type='input' />)

    // search for input
    const inputElement = component.container.querySelector('input')
    expect(inputElement).toBeInTheDocument()
  })

  test('on icon clicked, options is opened', () => {
    const label = 'Select'
    const value = 0

    const options = []

    const component = render(<Select value={{ label: label, value: value }} options={options} />)

    const labelElement = component.getByText(label)
    labelElement.click()

    expect(component.container).toHaveTextContent('No options')
  })

  test('on icon clicked, options ara showed', () => {
    const label = 'Select'
    const value = 0

    const options = [{ label: 'Option 1', value: 0 }, { label: 'Option 2', value: 1 }]

    const component = render(<Select value={{ label: label, value: value }} options={options} />)

    const labelElement = component.getByText(label)
    labelElement.click()

    expect(component.container).toHaveTextContent(options[0].label)
    expect(component.container).toHaveTextContent(options[1].label)
  })

  test('on option selected, event is triegered', () => {
    const label = 'Select'
    const value = 0

    const options = [{ label: 'Option 1', value: 0 }, { label: 'Option 2', value: 1 }]

    const setValue = jest.fn()

    const component = render(<Select value={{ label: label, value: value }} options={options} setValue={setValue} />)

    const labelElement = component.getByText(label)
    labelElement.click()

    const optionElement = component.getByText(options[0].label)
    optionElement.click()

    expect(setValue).toHaveBeenCalled()
    // check that param is the option
    expect(setValue).toHaveBeenCalledWith(options[0])
  })

  test('on input change, event is triegered', async () => {
    const label = 'Select'
    const value = 0

    const options = [{ label: 'Option 1', value: 0 }, { label: 'Option 2', value: 1 }]

    const handleInputChanged = jest.fn()

    const setValue = jest.fn()

    const component = render(<Select value={{ label: label, value: value }} type='input' options={options} setValue={setValue} handleInputChanged={handleInputChanged} />)

    const inputElement = component.container.querySelector('input')
    fireEvent.change(inputElement, { target: { value: 'Option 1' } })

    expect(setValue).toHaveBeenCalled()
  })
})
