// Full Stack open, The University of Helsinki
// Exercises 5.13 - 5.16 Blog List Tests
// Url : https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16
// Created on 2026-09-11 01:31 HKT

// Change log :
// 1. exercise 5.16: Blog List Tests, step 4 (Sept 11, 2026)
//    -> check event handler receives right details when create new
// 2. exercise 11.21: Your own pipeline (Oct 1, 2026)
//    -> fix issues after combining frontend and backend

import { render, screen, waitFor } from '@testing-library/react'
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

    const titleInput = screen.getByRole('textbox', { name: /title/i })
    await user.type(titleInput, newBlog.title)

    const authorInput = screen.getByRole('textbox', { name: /author/i })
    await user.type(authorInput, newBlog.author)

    const urlInput = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlInput, newBlog.url)

    const createButton = screen.getByRole('button', { name: /create/i })
    await user.click(createButton)

    expect(mockCreateHandler.mock.calls).toHaveLength(1)
    expect(mockCreateHandler.mock.calls[0][0]).toEqual(newBlog)

  })

  // exercise 11.21: verify flake cases are eliminated
  test('clears the form after blog creation completes', async () => {
    const user = userEvent.setup()
    let finishCreate
    const createPromise = new Promise(resolve => {
      finishCreate = resolve
    })
    const mockCreateHandler = vi.fn(() => createPromise)

    render(<BlogForm createBlog={mockCreateHandler} />)

    await user.type(screen.getByRole('textbox', { name: /title/i }), newBlog.title)
    await user.type(screen.getByRole('textbox', { name: /author/i }), newBlog.author)
    await user.type(screen.getByRole('textbox', { name: /url/i }), newBlog.url)
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue(newBlog.title)
    expect(screen.getByRole('textbox', { name: /author/i })).toHaveValue(newBlog.author)
    expect(screen.getByRole('textbox', { name: /url/i })).toHaveValue(newBlog.url)

    finishCreate()
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('')
      expect(screen.getByRole('textbox', { name: /author/i })).toHaveValue('')
      expect(screen.getByRole('textbox', { name: /url/i })).toHaveValue('')
    })
  })
})