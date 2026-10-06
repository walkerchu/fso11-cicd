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
  name: 'Ariel Lai',
  username: 'ariel',
  password: 'lai',
}

const testBlog = {
  title: 'The Preserving Machine',
  author: 'Ariel Lai',
  url: 'http://www.ariel.edu',
}

// exercise 11.21: rewrite the test as 'create' form is moved
test('5.21.1 blog can be liked after login', async ({ page, request }) => {


  console.log(`running: ${test.info().title}`)

  await request.post('http://localhost:3003/api/testing/reset')
  await request.post('http://localhost:3003/api/users', {
    data: testUser
  })

  await page.goto('http://localhost:5173/login')
  await page.waitForURL(/\/login$/)
  await page.waitForLoadState('networkidle')

  await loginWith(page, testUser.username, testUser.password)
  await expect(page.getByTestId('logoutButton')).toBeVisible()
  await page.waitForLoadState('networkidle')
  await createBlog(page, testBlog)

  const blogLink = page.getByTestId('blogRowLink').filter({ hasText: testBlog.title })
  await blogLink.click()
  await page.waitForURL('**/blogs/**')

  const likesLocator = page.getByTestId('numLikes')
  await expect(likesLocator).toBeVisible()

  const likesText = await likesLocator.textContent()
  const initLikes = parseInt(likesText ?? 'NaN', 10)

  expect(Number.isNaN(initLikes)).toBe(false)
  expect(initLikes).toBeGreaterThanOrEqual(0)

  await page.getByTestId('likeButton').click()
  await expect(likesLocator).toHaveText(String(initLikes + 1))
})
