// Full Stack open, The University of Helsinki
// Exercises 5.24–5.28 Routed Blogs
// Url : https://fullstackopen.com/en/part5/react_router_ui_frameworks#exercises-5-24-5-28
// Created on 2026-09-19 01:31 HKT

// Change log :
// 1. exercise 5.28: routed blogs, step 5 (Sept 19, 2026)
//    -> fix the end-to-end tests created with Playwright
// 2. exercise 5.31: styled blogs, step 3 (Sept 20, 2026)
//    -> fix broken tests after implementing Material UI
// 3. exercise 11.21: Your own pipeline (Oct 3, 2026)
//    -> fix issues after combining frontend and backend

import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper-func'

const testUsers = {
  name: 'Elly Chan',
  username: 'elly',
  password: 'chan', }

const testBlogs = [
  { title: 'Mosquito Bites', author: 'Elly Chan', url: 'http://www.mosquito.com', },
  { title: 'Cooking Past', author: 'Elly Chan', url: 'http://www.cooking.com', },
]

test('5.28.10 created blogs are correct', async ({ page, request }) => {

  console.log(`running: ${test.info().title}`)

  await request.post('http://localhost:3003/api/testing/reset')
  await request.post('http://localhost:3003/api/users', { data: testUsers })

  await page.goto('http://localhost:5173/login')
  await loginWith(page, testUsers.username, testUsers.password)
  await page.waitForURL('http://localhost:5173/') // ensure redirect finished
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('logoutButton')).toBeVisible()

  // create new blogs
  for (const blog of testBlogs) {
    await createBlog(page, blog)
  }

  // verify blog details are correctly displayed
  for (const blog of testBlogs) {
    const blogLink = page.getByTestId('blogRowLink').filter({ hasText: blog.title })
    await expect(blogLink).toBeVisible()
    await blogLink.click()

    await page.waitForURL('**/blogs/**')
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('blogTitle')).toContainText(blog.title)
    await expect(page.getByTestId('blogAuthor')).toContainText(blog.author)
    await expect(page.getByTestId('blogUrl')).toContainText(blog.url)

    await expect(page.locator('text=0 likes')).toBeVisible()
    await expect(page.locator(`text=Added by ${blog.author}`)).toBeVisible()

    await expect(page.getByTestId('likeButton')).toBeVisible()
    await expect(page.getByTestId('removeButton')).toBeVisible()

    await page.getByTestId('blogsLink').click()
    await page.waitForURL(url => url.pathname === '/')
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('blogsHeader')).toBeVisible()
  }
})
