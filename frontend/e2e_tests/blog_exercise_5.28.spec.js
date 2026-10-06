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
  { name: 'Mary Chan', username: 'mary', password: 'chan', },
  { name: 'Kitene Lee', username: 'kitene',password: 'lee', }
]

const testBlogs = [
  { title: 'Mosquito Bites', author: 'Mary Chan', url: 'http://www.mosquito.com', },
  { title: 'Cooking Past', author: 'Mary Chan', url: 'http://www.cooking.com', },
]

test.describe('before login - login page', () => {

  test.beforeEach(async ({ page }) => {
    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173/login')
  })


  test('5.28.1 page title is correct', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Full Stack Open - part 11')
  })

  test('5.28.2 top menu label is correct', async ({ page }) => {
    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu).toContainText('blogs')
    await expect(topMenu).toContainText('login')
  })

  test('5.28.3 header is correct', async ({ page }) => {
    await expect(page.getByTestId('loginHeader')).toBeVisible()
  })

  test('5.28.4 input box to have label', async ({ page }) => {
    await expect(page.getByRole('textbox',
      { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox',
      { name: 'password' })).toBeVisible()
  })

  test('5.28.5 button label is correct', async ({ page }) => {
    await expect(page.getByRole('button',
      { name: 'login' })).toBeVisible()
  })
})  // end of test.describe

test.describe('before login - blog page', () => {

  test('5.28.6 top menu label is correct - before login', async ({ page }) => {

    console.log(`running: ${test.info().title}`)

    await page.goto('http://localhost:5173/login')
    await expect(page.getByTestId('loginHeader')).toBeVisible()

    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu).toContainText('blogs')
    await expect(topMenu).toContainText('login')
  })

  test('5.28.7 blog contents are correct - before login', async ({ page, request }) => {

    console.log(`running: ${test.info().title}`)

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data: testUsers[0] })

    await page.goto('http://localhost:5173/login')
    await page.waitForURL(/\/login$/)
    await expect(page.getByTestId('loginHeader')).toBeVisible() // log in to application

    // login and create blogs for preparing test data
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await page.waitForURL(url => url.pathname === '/')
    await expect(page.getByTestId('logoutButton')).toBeVisible()

    for (const blog of testBlogs) {
      await createBlog(page, blog)
    }

    // logout and fall back to login page
    await page.getByTestId('logoutButton').click()
    await expect(page.getByTestId('loginHeader')).toBeVisible()

    // go to blog list page to verify correctness of blog details
    await page.getByTestId('blogsLink').click()
    await page.waitForURL(url => url.pathname === '/')
    await expect(page.getByTestId('blogsHeader')).toBeVisible()

    for (const blog of testBlogs) {
      const blogLink = page.getByTestId('blogRowLink').filter({ hasText: blog.title })

      await expect(blogLink).toBeVisible()
      await blogLink.click()

      await expect(page.getByTestId('blogTitle')).toContainText(blog.title)
      await expect(page.getByTestId('blogAuthor')).toContainText(blog.author)

      await expect(page.locator(`text=${blog.url}`)).toBeVisible()
      await expect(page.locator('text=0 likes')).toBeVisible()
      await expect(page.locator(`text=Added by ${blog.author}`)).toBeVisible()

      await expect(page.getByTestId('likeButton')).not.toBeVisible()
      await expect(page.getByTestId('removeButton')).not.toBeVisible()

      await page.getByTestId('blogsLink').click()
      await page.waitForURL(url => url.pathname === '/')
    }
  })
}) // end of test.describe


test.describe('after login - login page', () => {

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data: testUsers[0] })

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173/login')
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('loginHeader')).toBeVisible() // log in to application
  })

  test('5.28.8 after login top menu label is correct', async ({ page }) => {
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu).toContainText('blogs')
    await expect(topMenu).toContainText('new blog')
    await page.waitForURL(url => url.pathname === '/')
    await expect(topMenu.getByTestId('logoutButton')).toBeVisible()
  })

  test('5.28.9 fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'invalid_username', 'invalid_password')

    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu.getByTestId('logoutButton')).not.toBeVisible()

    await expect(page).toHaveURL(/\/login$/)

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('color', 'rgb(95, 33, 32)') // font colour
    await expect(errorDiv).toHaveCSS('border-color', 'rgb(95, 33, 32)')
    await expect(errorDiv).not.toHaveCSS('border-style', 'solid')

    // Give a 1000ms buffer to account for hardware/execution variance
    await expect(errorDiv).toBeHidden({ timeout: 6000 })
  })

}) // end of test.describe

test.describe('after login - blog page - logged in user = author', () => {

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data: testUsers[0] })

    await page.goto('http://localhost:5173/login')
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('logoutButton')).toBeVisible()

    for (const blog of testBlogs) {
      await createBlog(page, blog)
    }

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('logoutButton')).toBeVisible()


  }) // end of beforeEach

  test('5.28.12 logged-in user can like blogs', async ({ page }) => {

    await page.getByTestId('blogRowLink').filter({ hasText: testBlogs[0].title }).click()

    await expect(page.getByTestId('blogTitle')).toContainText(testBlogs[0].title)
    await expect(page.getByTestId('blogAuthor')).toContainText(testBlogs[0].author)

    const initLikes = parseInt(await page.getByTestId('numLikes').innerText(), 10)

    await page.getByTestId('likeButton').click()
    await expect(page.getByTestId('numLikes')).toContainText(`${initLikes + 1}`)
  })

})  // end of test.describe


test.describe('after login - blog page - logged in user != author', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    // Create two users 'root' and 'canny'
    await request.post('http://localhost:3003/api/users', { data: testUsers[0] })
    await request.post('http://localhost:3003/api/users', { data: testUsers[1] })

    // Log in as 'Mary' to create a blog post
    await page.goto('http://localhost:5173/login')
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await expect(page.getByTestId('logoutButton')).toBeVisible()
    await createBlog(page, testBlogs[0])

    // Log out 'Mary'
    await page.getByTestId('logoutButton').click()
    await page.waitForURL(/\/login$/)

    // Log in as 'Kitene'
    await loginWith(page, testUsers[1].username, testUsers[1].password)
    await expect(page.getByTestId('logoutButton')).toBeVisible()

    console.log(`running: ${test.info().title}`)

  })

  test('5.28.14 non-author sees like button but remove button is hidden', async ({ page }) => {
    // Navigate to blog post created by 'Mary'
    await page
      .getByRole('link', { name: `${testBlogs[0].title} by ${testBlogs[0].author}` })
      .click()
    await page.waitForURL(/\/blogs\//)

    // Verify button visibilities for non-author
    await expect(page.getByTestId('blogTitle')).toContainText(testBlogs[0].title)
    await expect(page.getByTestId('blogAuthor')).toContainText(testBlogs[0].author)

    await expect(page.getByTestId('likeButton')).toBeVisible()
    await expect(page.getByTestId('removeButton')).not.toBeVisible()
  })

})