import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import CodeBox from './CodeBox'

jest.mock('./Loading', () => {
  return jest.fn(() => {
    return <div>Loading</div>
  })
})

jest.mock('../styles/Codebox.module.css', () => ({
  tabs_content_item_info_heart: 'like_div'
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path'
  }),
  useHistory: () => ({
    push: jest.fn()
  }),
  useParams: () => ({
    id: 'test'
  }),
  useSearchParams: () => ({
    get: jest.fn()
  }),
  useNavigate: () => ({
    navigate: jest.fn()
  })
}))

describe('CodeBox', () => {
  test('renders content', () => {
    const files = []
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    expect(component.getByText('No existing files')).toBeInTheDocument()
  })

  test('shows file', () => {
    const files = [
      {
        dir: false,
        name: 'test.js',
        fileContent: 'test'
      }
    ]
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    expect(component.getByText(files[0].name)).toBeInTheDocument()
    const fileIcon = component.container.querySelector('.code-box-content-item-file')
    expect(fileIcon).toBeInTheDocument()
  })

  test('shows folder', () => {
    const files = [
      {
        dir: true,
        name: 'test.js',
        fileContent: [

        ]
      }
    ]
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    expect(component.getByText(files[0].name)).toBeInTheDocument()
    const fileIcon = component.container.querySelector('.code-box-content-item-folder')
    expect(fileIcon).toBeInTheDocument()
  })

  test('if clicks in an accepted file shows content', async () => {
    const files = [
      {
        dir: false,
        name: 'test.js',
        content: new Promise(resolve => resolve('lorem ipsum'))
      }
    ]
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    const folder = component.container.querySelector('.code-box-content-item-file')
    fireEvent.click(folder.parentElement)

    await new Promise(resolve => setTimeout(resolve, 2000))

    expect(component.getByText('lorem ipsum')).toBeInTheDocument()
  })

  test('if clicks in a not accepted file shows message not accepted', async () => {
    const files = [
      {
        dir: false,
        name: 'test.kr',
        content: new Promise(resolve => resolve('lorem ipsum'))
      }
    ]
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    const folder = component.container.querySelector('.code-box-content-item-file')
    fireEvent.click(folder.parentElement)

    expect(component.getByText('Not supported')).toBeInTheDocument()
  })

  test('if clicks in an empty folder shows no content', () => {
    const files = [
      {
        dir: true,
        name: 'test.js',
        content: [

        ]
      }
    ]
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    const folder = component.container.querySelector('.code-box-content-item-folder')
    fireEvent.click(folder.parentElement)

    expect(component.getByText('No existing files')).toBeInTheDocument()
    const goUp = component.container.querySelector('.icon-go-up')
    expect(goUp).toBeInTheDocument()
  })

  test('if clicks in a folder with content and shows content', () => {
    const files = [
      {
        dir: true,
        name: 'test.js',
        content: [
          {
            dir: false,
            name: 'test.js',
            content: ''
          }
        ]
      }
    ]
    const download = ''

    const component = render(
      <BrowserRouter>
        <CodeBox files={files} download={download} />
      </BrowserRouter>
    )

    const folder = component.container.querySelector('.code-box-content-item-folder')
    fireEvent.click(folder.parentElement)

    expect(component.getByText('test.js')).toBeInTheDocument()
    const goUp = component.container.querySelector('.icon-go-up')
    expect(goUp).toBeInTheDocument()
  })
})
