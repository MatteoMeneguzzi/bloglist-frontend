import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

import userEvent from '@testing-library/user-event'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'matteo mene',
  }

  render(<Blog blog={blog} />)

  const elements = screen.queryAllByText(
    'Component testing is done with react-testing-library matteo mene'
  )
  expect(elements[0]).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'matteo mene',
    likes: 10,
    url: 'ww.mene.it',
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
