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

const testUsers = [
  { name: 'Cali Wong', username: 'cali', password: 'wong', },
  { name: 'Eva Wang', username: 'eva',password: 'wang', }
]

const testBlogs = [
  { title: 'Mosquito Bites', author: 'Cali Wong', url: 'http://www.mosquito.com', },
  { title: 'Cooking Past', author: 'Cali Wong', url: 'http://www.cooking.com', },
]

test('5.28.13 logged-in user can delete blogs', async ({ page, request }) => {

  console.log(`running: ${test.info().title}`)

  await request.post('http://localhost:3003/api/testing/reset')

  // Create two users 'cali' and 'eva'
  await request.post('http://localhost:3003/api/users', { data: testUsers[0] })

  // Log in as 'cali' to create a blog post
  await page.goto('http://localhost:5173/login')
  await loginWith(page, testUsers[0].username, testUsers[0].password)
  await page.waitForURL('http://localhost:5173/') // ensure redirect finished
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('logoutButton')).toBeVisible()
  await createBlog(page, testBlogs[0])

  // click 'Mosquito Bites by Cali Wong'
  const blogRowLink = page.getByTestId('blogRowLink').filter({ hasText: testBlogs[0].title })
  await blogRowLink.waitFor({ state: 'visible' })
  await blogRowLink.click()

  await page.waitForURL('**/blogs/**')
  await page.waitForLoadState('networkidle')

  await expect(page.getByTestId('blogTitle')).toContainText(testBlogs[0].title)
  await expect(page.getByTestId('blogAuthor')).toContainText(testBlogs[0].author)

  // setup listener FIRST dialog
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe(`Remove blog: ${testBlogs[0].title} by ${testBlogs[0].author} ?`)
    expect(dialog.type()).toBe('confirm')
    await dialog.accept() // accepts the confirm window
  })

  await page.getByTestId('removeButton').click()
  await page.waitForURL(url => url.pathname === '/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('blogsHeader')).toBeVisible()

  await expect(page
    .getByRole('link', { name:`${testBlogs[0].title} by ${testBlogs[0].author}` } ))
    .not.toBeVisible()

})