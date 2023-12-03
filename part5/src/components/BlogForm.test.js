import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blogform from './BlogForm'

describe('<Blog />', () => {

  let mockHandler
  beforeEach(() => {

    mockHandler = jest.fn()

    render(<Blogform createBlog={mockHandler} />)
  })

  test('createBlog mockHandler is called with right details when blog is created', async () => {

    const user = userEvent.setup()
    const title = screen.getByPlaceholderText('write blog title here')
    const author = screen.getByPlaceholderText('write blog author here')
    const url = screen.getByPlaceholderText('write blog url here')

    const sendButton = screen.getByText('create')

    await user.type(title, 'New Test blog')
    await user.type(author, 'alpha tester')
    await user.type(url, 'test.me/alphablog')
    await user.click(sendButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
  })
})