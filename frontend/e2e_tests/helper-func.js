// Full Stack open, The University of Helsinki
// Exercises 5.17 - 5.23 Blog List End To End Testing
// Url : https://fullstackopen.com/en/part5/end_to_end_testing#exercises-5-17-5-23
// Created on 2026-09-12 14:32 HKT

// Change log :
// 1. exercise 5.18: Blog List End To End Testing, step 2 (Sept 12, 2026)
//    -> create login helper function
// 2. exercise 5.19: Blog List End To End Testing, step 3 (Sept 12, 2026)
//    -> create create blog helper function
// 3. exercise 11.21: Your own pipeline (Oct 1, 2026)
//    -> fix issues after combining frontend and backend

import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByTestId('usernameInput').fill(username)
  await page.getByTestId('passwordInput').fill(password)
  await page.getByTestId('loginButton').click()
}

const createBlog = async (page, blog) => {
  await expect(page.getByTestId('createLink')).toBeVisible({ timeout: 30000 })
  await page.getByTestId('createLink').click()
  await page.waitForURL(/\/create$/)
  await expect(page.getByTestId('createNewHeader')).toBeVisible({ timeout: 30000 })

  const inputTitle = page.getByTestId('titleInput' )
  await inputTitle.waitFor({ state: 'visible', timeout: 30000 })
  await inputTitle.fill(blog.title)

  const inputAuthor = page.getByTestId('authorInput' )
  await inputAuthor.waitFor({ state: 'visible', timeout: 30000 })
  await inputAuthor.fill(blog.author)

  const inputUrl = page.getByTestId('urlInput' )
  await inputUrl.waitFor({ state: 'visible', timeout: 30000 })
  await inputUrl.fill(blog.url)

  await page.getByRole('button', { name: 'create' }).click()

  // Wait for backend response before checking UI
  await page.waitForResponse(resp =>
    resp.url().includes('/api/blogs') && resp.status() === 201)

  const blogLink = page.getByTestId('blogRowLink').filter({ hasText: blog.title })
  await blogLink.waitFor({ state: 'visible', timeout: 30000 })
}

export { loginWith, createBlog }