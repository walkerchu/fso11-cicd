// Full Stack open, The University of Helsinki
// Exercises 5.17 - 5.23 Blog List End To End Testing
// Url : https://fullstackopen.com/en/part5/end_to_end_testing#exercises-5-17-5-23
// Created on 2026-09-13 15:48 HKT

// REMARK :
// - exercise 5.17 to 5.22 are coded in 'blog_app.sec.js'
// - this file is solely for exercise 5.23

import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper-func'

// exercise 5.23: blogs are ordered by likes (most likes first)
test.describe('test for exercise 5.23', () => {

  const testUser = {
    name: 'Michael Chan',
    username: 'root',
    password: 'secret',
  }

  const testBlogs =[
    { title: 'Pancakes', author: 'Michael Chan', url: 'http://www.pancakes.hk', like:1 },
    { title: 'Carbuncles', author: 'Michael Chan', url: 'http://www.carbuncles.hk', like:10 },
    { title: 'Deception', author: 'Michael Chan', url: 'http://www.deception.hk', like:3 },
  ]

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data: testUser })

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  test('blogs are ordered by likes', async ({ page }) => {

    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByText(`${testUser.name} logged in`)).toBeVisible()

    for (const blog of testBlogs) {
      await createBlog(page, blog)
    }
    // assert blogs have successfully inserted
    await expect(page.locator('div.blog_row')).toHaveCount(testBlogs.length)

    // expend details block and click like button
    for (const blog of testBlogs) {
      const blogRow = page.locator('div.blog_row').filter({ hasText: blog.title }).first()
      await blogRow.getByRole('button', { name: 'view' }).click()

      const blogDetails = blogRow.locator('xpath=following-sibling::div[1]')

      for (let i=1; i<=blog.like; i++) {
        await blogDetails.getByRole('button', { name: 'like' }).click()
        await expect(blogDetails.locator('#numLikes')).toContainText(`${i}`)
      }
      await blogRow.getByRole('button', { name: 'hide' }).click() // reset state cleanly
    }

    // Extract actual titles in rendered order
    const actualTexts = await page.locator('div.blog_row').allInnerTexts()

    // Match each rendered row text to its corresponding title in testBlogs
    const actualTitles = actualTexts.map(text =>
      testBlogs.find(blog => text.includes(blog.title))?.title
    )

    // Sort testBlogs dynamically in descending order of likes
    const expectedTitles = [...testBlogs]
      .sort((a, b) => b.like - a.like)
      .map(blog => blog.title)

    // Assert exact order alignment across all items
    expect(actualTitles).toEqual(expectedTitles)
  })

})





