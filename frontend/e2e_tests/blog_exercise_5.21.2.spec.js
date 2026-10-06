// Full Stack open, The University of Helsinki
// Exercises 5.17 - 5.23 Blog List End To End Testing
// Url : https://fullstackopen.com/en/part5/end_to_end_testing#exercises-5-17-5-23
// Created on 2026-09-12 00:43 HKT

// Change log :
// 1. exercise 5.17: Blog List End To End Testing, step 1 (Sept 12, 2026)
//    -> Test login page is displayed by default
// 2. exercise 5.18: Blog List End To End Testing, step 2 (Sept 12, 2026)
//    -> Test both successful and failed login
// 3. exercise 5.19: Blog List End To End Testing, step 3 (Sept 12, 2026)
//    -> Verify logged user can create a blog
// 4. exercise 5.20: Blog List End To End Testing, step 4 (Sept 13, 2026)
//    -> Verify blog can be liked
// 5. exercise 5.21: Blog List End To End Testing, step 5 (Sept 13, 2026)
//    -> Verify user who added blog can delete blog
// 6. exercise 5.22: Blog List End To End Testing, step 6 (Sept 13, 2026)
//    -> Verify only user added the blog see delete button
// 7. exercise 5.28: routed blogs, step 5 (Sept 18, 2026)
//    -> Fixing the end-to-end tests
// 8. exercise 11.21: Your own pipeline (Oct 1, 2026)
//    -> fix issues after combining frontend and backend

import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper-func'

const testUser = {
  name: 'Grace Wang',
  username: 'grace',
  password: 'wang',
}

const testBlog = {
  title: 'The Preserving Machine 2',
  author: 'Grace Wang',
  url: 'http://www.grace.edu',
}

// exercise 11.21: add new test for before login section
test('5.21.2 no like button if does not login', async ({ page, request }) => {

  console.log(`running: ${test.info().title}`)

  await request.post('http://localhost:3003/api/testing/reset')
  await request.post('http://localhost:3003/api/users', {
    data: testUser
  })

  await page.goto('http://localhost:5173/login')
  await page.waitForURL(/\/login$/)
  await page.waitForLoadState('networkidle')

  await expect(page.getByTestId('loginHeader')).toContainText('log in to application')

  // login and create new blog
  await loginWith(page, testUser.username, testUser.password)
  await expect(page.getByTestId('logoutButton')).toBeVisible()
  await page.waitForLoadState('networkidle')
  await createBlog(page, testBlog)  // create new blog

  // logout
  await page.getByTestId('logoutButton').click() // logout
  await page.waitForURL(/\/login$/)

  // go to blogs list page
  await page.getByTestId('blogsLink').click()
  await page.waitForURL(url => url.pathname === '/')
  await expect(page.getByTestId('blogsHeader')).toBeVisible()  // blogs

  await page.getByTestId('blogRowLink').filter({ hasText: testBlog.title }).click()
  await expect(page.getByRole('button', { name: /like/i })).toBeHidden()
})
