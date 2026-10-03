// Full Stack open, The University of Helsinki
// Exercises 5.17 - 5.23 Blog List End To End Testing
// Url : https://fullstackopen.com/en/part5/end_to_end_testing#exercises-5-17-5-23
// Created on 2026-09-13 15:48 HKT

// REMARK :
// - exercise 5.17 to 5.22 are coded in 'blog_exercise_5,17-22.spec.js'
// - this file is solely for exercise 5.23

// Change log :
// 1. exercise 5.23: Blog List End To End Testing, step 7 (Sept 13, 2026)
//    -> blogs are ranked by number of likes
// 2. exercise 11.21: Your own pipeline (Oct 3, 2026)
//    -> fix issues after combining frontend and backend

import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper-func'

// exercise 5.23: blogs are ordered by likes (most likes first)
test.describe('test for exercise 5.23', () => {

  const testUser = {
    name: 'Michael Chan',
    username: 'michael',
    password: 'chan',
  }

  const testBlogs =[
    { title: 'Pancakes', author: 'Michael Chan', url: 'http://www.pancakes.hk', like:7 },
    { title: 'Carbuncles', author: 'Michael Chan', url: 'http://www.carbuncles.hk', like:2 },
    { title: 'Deception', author: 'Michael Chan', url: 'http://www.deception.hk', like:5 },
  ]

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data: testUser })

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173/login')
  })

  test('blogs are ordered by likes', async ({ page }) => {

    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

    for (const blog of testBlogs) {
      await createBlog(page, blog)
    }
    // assert blogs have successfully inserted
    await expect(page.locator('a.blog_row')).toHaveCount(testBlogs.length)

    // goto details block and click like button
    for (const blog of testBlogs) {

      const blogLink = page.locator('a.blog_row').filter({ hasText: blog.title })
      await blogLink.click()
      await page.waitForURL('**/blogs/**')

      // loop to click the 'like' button
      for (let i=1; i<=blog.like; i++) {

        await page.getByRole('button', { name: /like/i }).click()
        await expect(page.getByTestId('numLikes')).toHaveText(String(i))
      }

      // back to blog list page
      await page.getByRole('link', { name: 'blogs' }).click()
      await page.waitForURL(url => url.pathname === '/')
    }

    // Sort testBlogs dynamically in descending order of likes
    const expectedTitles = [...testBlogs]
      .sort((a, b) => b.like - a.like)
      .map(blog => blog.title)

    // put assertion inside expect.poll() is to
    // avoid flakiness risk caused by .allInnerTexts()
    await expect.poll(async () => {
      const actualTexts = await page.locator('a.blog_row').allInnerTexts()
      return actualTexts.map(text =>
        testBlogs.find(blog => text.includes(blog.title))?.title
      )
    }).toEqual(expectedTitles)
  })

})





