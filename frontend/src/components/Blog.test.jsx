// Full Stack open, The University of Helsinki
// Exercises 5.13 - 5.16 Blog List Tests
// Url : https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16
// Created on 2026-09-09 01:46 HKT

// Change log :
// 1. exercise 5.13: Blog List Tests, step 1 (Sept 9, 2026)
//    -> check title/author are displayed but not url/likes
// 2. exercise 5.14: Blog List Tests, step 2 (Sept 10, 2026)
//    -> check clicking biew button will show details
// 3. exercise 5.15: Blog List Tests, step 3 (Sept 10, 2026)
//    -> check like button clicks twice
// 4. exercise 11.21: Your own pipeline (Oct 1, 2026)
//    -> fix issues after combining frontend and backend

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom' // added by exercise 11.21
import Blog from './Blog'
import { expect } from 'vitest'

let user // for user event session
let updateLikes
let blog

beforeEach(() => {
  blog = {
    id: '60d5ec49f1b2c81234567890',
    title: 'The Clockwork Soup Spoon',
    author: 'Barnaby Quigley',
    url: 'www.Barnaby.Quigley.org.hk',
    likes: 13,
    user: {
      name: 'John Doe',
      username: 'johndoe' // username attached to the blog post
    }
  }
  user = userEvent.setup()
  updateLikes = vi.fn()

  // exercise 11.21 : added </MemoryRouter>
  render(
    <MemoryRouter>
      <Blog blog={blog} updateLikes={updateLikes} loggedUsername="johndoe"/>
    </MemoryRouter>)
})

// Exercise 5.13: check title / author / url / likes
describe('exercise 5.13 tests', () => {

  test('title is rendered', () => {
    const element = screen.getByText(blog.title, { exact: false })
    expect(element).toBeDefined()
  })

  test('author is rendered', () => {
    const element = screen.getByText(blog.author, { exact: false })
    expect(element).toBeDefined()
  })

  test('url is not rendered', () => {
    const element = screen.queryByText(blog.url)
    expect(element).toBeNull()
  })

  test('likes is not rendered', () => {
    expect(screen.queryByText('likes')).toBeNull()
  })
})

// Exercise 11.21: add tests based on new UI
describe('exercise 11.21 additional tests', () => {

  test('link destination is correct', () => {
    const link = screen.getByRole('link', { name: new RegExp(blog.title, 'i') })
    expect(link.href).toContain(`/blogs/${blog.id}`)
  })
})



// Exercise 5.14: check clicking view/hide button
// Exercose 11.21: skip as respective UI is removed
describe.skip('exercise 5.14 tests', () => {

  test('button label change to hide after click', async () => {
    const viewButton = await screen.queryByRole('button', { name: /view/i })
    await user.click(viewButton)
    const hideButton = await screen.findByRole('button', { name: /hide/i })
    expect(hideButton).toHaveTextContent(/hide/i)
  })

  test('details block include url / likes', async () => {
    const viewButton = screen.queryByRole('button', { name: /view/i })
    await user.click(viewButton)
    const url = screen.getByText(blog.url, { exact: false })
    expect(url).toBeDefined()

    const likes = screen.getByText(`likes ${blog.likes}`, { exact: false })
    expect(likes).toBeDefined()

    const username = screen.getByText(blog.user.name, { exact: false })
    expect(username).toBeDefined()
  })
})

// Exercise 5.15: check like button clicks twice
// Exercose 11.21: skip as respective UI is removed
describe.skip('exercise 5.15 tests', () => {

  test('click like button twice', async () => {

    const viewButton = screen.queryByRole('button', { name: /view/i })
    await user.click(viewButton) // click to show details block

    const likeButton = screen.queryByRole('button', { name: /like/i })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateLikes).toHaveBeenCalledTimes(2)
    expect(updateLikes.mock.calls).toHaveLength(2)
  })

})

