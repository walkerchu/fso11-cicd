// Full Stack open, The University of Helsinki
// Exercises 5.13 - 5.16 Blog List Tests
// Url : https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16
// Created on 2026-09-11 01:31 HKT

// Change log :
// 1. exercise 5.16: Blog List Tests, step 4 (Sept 11, 2026)
//    -> check event handler receives right details when create new

import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


const newBlog = {
  title: 'Artificial Weightlessness',
  author: 'Andy Gravity',
  url: 'www.Andy.Gravity.org.hk', }


// Exercise 5.16: check creating new blog
describe('exercise 5.16 tests', () => {

  test('create new blog', async () => {

    const user = userEvent.setup()
    const mockCreateHandler = vi.fn()

    render(<BlogForm createBlog={mockCreateHandler} />)

    const titleInput = screen.getByRole('textbox', { name: /title:/i })
    await user.type(titleInput, newBlog.title)

    const authorInput = screen.getByRole('textbox', { name: /author:/i })
    await user.type(authorInput, newBlog.author)

    const urlInput = screen.getByRole('textbox', { name: /url:/i })
    await user.type(urlInput, newBlog.url)

    const createButton = screen.queryByRole('button', { name: /create/i })
    await user.click(createButton)

    expect(mockCreateHandler.mock.calls).toHaveLength(1)
    expect(mockCreateHandler.mock.calls[0][0]).toEqual(newBlog)

  })
})