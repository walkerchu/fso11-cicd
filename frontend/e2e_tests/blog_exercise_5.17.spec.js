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

// exercise 5.17: login page is displayed by default
test.describe('5.17.1 test for exercise 5.17', () => {

  test.beforeEach(async ({ page }) => {
    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  test('5.17.2 page title is correct', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Full Stack Open - part 11')
  })

  test('5.17.3 header is correct', async ({ page }) => {
    await expect(page.getByTestId('blogsHeader')).toBeVisible() // blogs
  })

  test('5.17.4 input box and button labels are correct', async ({ page }) => {
    await page.getByTestId('loginLink').click()
    await page.waitForURL(/\/login$/)

    await expect(page.getByTestId('loginHeader')).toContainText('log in to application')

    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByTestId('usernameInput')).toBeVisible()

    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByTestId('passwordInput')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })
})

