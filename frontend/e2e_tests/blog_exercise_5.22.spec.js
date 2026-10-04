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


// exercise 5.22: verify only user who added blog can see delete button
test.describe('test for exercise 5.22', () => {

  const testUsers = [
    { name: 'Chloe Chan', username: 'chloe', password: 'chan', },
    { name: 'Janice Hus', username: 'janice',password: 'hus', }
  ]

  const testBlogs = [
    { title: 'Mosquito Bites', author: 'Chloe Chan', url: 'http://www.mosquito.com', },
    { title: 'Cooking Past', author: 'Chloe Chan', url: 'http://www.cooking.com', },
  ]

  test('only blog-creator can see delete button', async ({ page, request }) => {

    console.log(`running: ${test.info().title}`)

    await request.post('http://localhost:3003/api/testing/reset')

    // create two users
    for (let i=0; i<testUsers.length; i++) {
      await request.post('http://localhost:3003/api/users', { data: testUsers[i] })
    }

    await page.goto('http://localhost:5173/login')  // login page
    await page.waitForURL(/\/login$/)

    // 1st user login and create two blogs
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await expect(page.getByTestId('logoutButton')).toBeVisible()

    for (let j=0; j<testBlogs.length; j++) {
      await createBlog(page, testBlogs[j])
    }

    // assert all blogs have successfully inserted
    await expect(page.getByTestId('blogRowLink')).toHaveCount(testBlogs.length)

    // verify creator (1st user) can see remove button
    for (const blog of testBlogs) {

      // click the respective blog link to land on details page
      const blogLink = page.getByTestId('blogRowLink').filter({ hasText: blog.title })
      await blogLink.click()

      // wait for the URL path to change to the details page route
      await page.waitForURL('**/blogs/**')

      // confirm land on the correct page by assert the blog.title
      const newBlogTitle = page.getByTestId('blogTitle').filter({ hasText: blog.title })
      await expect(newBlogTitle).toBeVisible()

      // assert the "remove" button is visible
      await expect(page.getByRole('button', { name: /remove/i })).toBeVisible()

      // click 'blogs' menu link and back to blog list page
      await page.getByRole('link', { name: 'blogs' }).click()
      await page.waitForURL(url => url.pathname === '/')
    }

    // 1st user logout
    await page.getByTestId('logoutButton').click()
    await page.waitForURL(/\/login$/)  // wait for landing on before login apge

    // then 2nd user login
    await loginWith(page, testUsers[1].username, testUsers[1].password)
    await expect(page.getByTestId('logoutButton')).toBeVisible()

    // verify non-creator (2nd user) cannot see remove button
    for (const blog of testBlogs) {

      const blogLink = page.getByTestId('blogRowLink').filter({ hasText: blog.title })
      await blogLink.click()

      await page.waitForURL('**/blogs/**')  // land on blogs list page

      const newBlogTitle = page.getByTestId('blogTitle').filter({ hasText: blog.title })
      await expect(newBlogTitle).toBeVisible()

      await expect(page.getByRole('button', { name: /remove/i })).not.toBeVisible()
      // await page.getByRole('link', { name: 'blogs' }).click()

      // back to blog list page by clicking 'blogs' menu item
      page.getByTestId('blogsLink').click()
      await page.waitForURL(url => url.pathname === '/')
    }
  })
})

