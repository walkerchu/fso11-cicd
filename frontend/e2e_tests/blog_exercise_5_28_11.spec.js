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

import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper-func'

test('5.28.11 show success notification when new blog created', async ({ page, request }) => {

  console.log(`running: ${test.info().title}`)

  const testUsers = {
    name: 'Milena D Kong',
    username: 'milena',
    password: 'kong', }

  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Milena D Kong',
    url: 'http://www.milena.hk', }

  await request.post('http://localhost:3003/api/testing/reset')
  await request.post('http://localhost:3003/api/users', { data: testUsers })

  await page.goto('http://localhost:5173/login')
  await loginWith(page, testUsers.username, testUsers.password)
  await page.waitForURL('http://localhost:5173/') // ensure redirect finished
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('logoutButton')).toBeVisible()

  await createBlog(page, newBlog)

  const successDiv = page.locator('.success')
  await expect(successDiv)
    .toContainText(`a new blog ${newBlog.title} by ${newBlog.author} added`)
  await expect(successDiv).toHaveCSS('color', 'rgb(30, 70, 32)') // font colour
  await expect(successDiv).toHaveCSS('border-color', 'rgb(30, 70, 32)')
  await expect(successDiv).not.toHaveCSS('border-style', 'solid')

  // Give a 1000ms buffer to account for hardware/execution variance
  await expect(successDiv).toBeHidden({ timeout: 6000 })

})
