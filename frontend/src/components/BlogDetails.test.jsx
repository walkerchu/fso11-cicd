// Full Stack open, The University of Helsinki
// Exercises 5.24–5.28 Routed Blogs
// Url : https://fullstackopen.com/en/part5/react_router_ui_frameworks#exercises-5-24-5-28
// Created on 2026-09-18 02:13 HKT

// Change log :
// 1. exercise 5.27: routed blogs, step 4 (Sept 18, 2026)
//    -> tests the single blog view by using Vitest
// 2. exercise 11.21: Your own pipeline (Oct 1, 2026)
//    -> fix issues after combining frontend and backend

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, test, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import BlogDetails from './BlogDetails'


const blog = {
  id: '5a422a85',
  title: 'The Clockwork Soup Spoon',
  author: 'Barnaby Quigley',
  url: 'www.Barnaby.Quigley.org.hk',
  likes: 13,
  user: {
    name: 'John Doe',
    username: 'johndoe' // username attached to the blog post
  }
}


// 'render' helper function with different logged user
const renderBlogDetails = (loggedUsername) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/5a422a85']}>
      <Routes>
        <Route path="/blogs/:id" element={
          <BlogDetails
            blogs={[blog]}
            updateLikes={updateLikes}
            loggedUsername= {loggedUsername}  // e.g. "johndoe"
            onDelete={onDelete} />
        } />
      </Routes>
    </MemoryRouter>
  )
}


let user
const updateLikes = vi.fn()
const onDelete = vi.fn()


describe('exercise 5.27a: logged in user = author', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
    renderBlogDetails('johndoe')
  })

  // exercise 11.21: remove ${blog.author} from header
  test('header is correct', () => {
    const header = screen.getByText(`${blog.title}`)
    expect(header).toBeVisible()
  })

  test('url is rendered', () => {
    const url = screen.getByText(blog.url)
    expect(url).toBeVisible()
  })

  // exercise 11.21: change to use .getByTestId()
  test('likes is rendered', () => {
    const likes = screen.getByTestId('numLikes')
    expect(Number(likes.textContent)).toBe(blog.likes)
  })

  test('user.name is rendered', () => {
    const userName = screen.getByText(`Added by ${blog.user.name}`)
    expect(userName).toBeVisible()
  })

  test('like button is clickable', async () => {

    const likeButton = screen.getByRole('button', { name: /like/i })
    await user.click(likeButton)
    expect(updateLikes).toHaveBeenCalledTimes(1)
  })

  // exercise 11.21: add new test to click like button twice
  test('clicking like button twice', async () => {
    const likeButton = screen.getByRole('button', { name: /like/i })

    await user.click(likeButton)
    expect(updateLikes).toHaveBeenCalledTimes(1)
    await user.click(likeButton)
    expect(updateLikes).toHaveBeenCalledTimes(2)
  })

  test('remove button is clickable', async () => {

    const removeButton = screen.getByRole('button', { name: /remove/i })
    await user.click(removeButton)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

}) // end of describe

describe('exercise 5.27b: logged in user != author', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
    renderBlogDetails('cannyhsu')
  })

  test('like button is rendered and clickable', async () => {
    const likeButton = screen.getByRole('button', { name: /like/i })
    expect(likeButton).toBeVisible()

    await user.click(likeButton)
    expect(updateLikes).toHaveBeenCalledTimes(1)

  })

  test('remove button is not rendered', () => {
    const removeButton = screen.queryByRole('button', { name: /remove/i })
    expect(removeButton).not.toBeInTheDocument()
  })

}) // end of describe


describe('exercise 5.27c: user does not logged in', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
    renderBlogDetails(null)
  })

  test('like button is not rendered', () => {
    const likeButton = screen.queryByRole('button', { name: /like/i })
    expect(likeButton).not.toBeInTheDocument()
  })

  test('remove button is not rendered', () => {
    const removeButton = screen.queryByRole('button', { name: /remove/i })
    expect(removeButton).not.toBeInTheDocument()
  })

}) // end of describe
