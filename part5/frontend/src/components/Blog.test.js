import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  let mockHandler1,mockHandler2
  beforeEach(() => {
    const blog = {
      title: 'How to handle update queries with Mo Algorithm',
      author: 'Shivang Bhawsar',
      url: 'abc.com',
      likes: 1729,
      user: { id: '12345' }
    }

    const blogUser = {
      username: 'Shivang',
      name: 'Shi',
      id: '12345'
    }

    mockHandler1 = jest.fn()
    mockHandler2 = jest.fn()

    render(<Blog blog={blog} removeBlog={mockHandler1} user={blogUser} incrementLikeCount={mockHandler2} />)
  })

  test('renders correct content only', () => {

    const element1 = screen.queryByText('How to handle update queries with Mo Algorithm')
    //screen.debug(element1)
    expect(element1).toBeDefined()

    const element2 = screen.queryByText('Shivang Bhawsar')
    expect(element2).toBeDefined()

    const element3 = screen.queryByText('abc.com')
    expect(element3.parentElement).toHaveStyle({ display: 'none' })

    const element4 = screen.getByTestId('number-of-likes')
    //screen.debug(element4)
    expect(element4.parentElement).toHaveStyle({ display: 'none' })
  })

  test('url and likes are shown when view blog is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.queryByText('view')
    await user.click(button)

    const element1 = screen.getByTestId('blog-url')
    //screen.debug(element1)
    expect(element1.parentElement).not.toHaveStyle({ display: 'none' })

    const element2 = screen.getByTestId('number-of-likes')
    //screen.debug(element2)
    expect(element2.parentElement).not.toHaveStyle({ display: 'none' })
  })

  test('when like button is clicked twice, prop component is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByTestId('like-button')
    await user.click(button)
    await user.click(button)

    expect(mockHandler2.mock.calls).toHaveLength(2)
  })
})