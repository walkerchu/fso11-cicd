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

const testUsers = [
  { name: 'Michael Chan', username: 'michael', password: 'chan', },
  { name: 'Canny Har', username: 'canny',password: 'har', }
]

const testBlogs = [
  { title: 'Mosquito Bites', author: 'Michael Chan', url: 'http://www.mosquito.com', },
  { title: 'Cooking Past', author: 'Michael Chan', url: 'http://www.cooking.com', },
]

// helper function for login
const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

// helper function for create blog
const createBlog = async (page, blog) => {

  await page.getByRole('link', { name: 'new blog' }).click()
  await page.waitForURL(/\/create$/)
  await expect(page.getByRole('heading', { name: /create new/i })).toBeVisible()

  const inputTitle = await page.getByRole('textbox',{ name: 'title' })
  await inputTitle.waitFor({ state: 'visible', timeout: 10000 })
  await inputTitle.fill(blog.title)

  const inputAuthor = await page.getByRole('textbox',{ name: 'author' })
  await inputAuthor.waitFor({ state: 'visible', timeout: 10000 })
  await inputAuthor.fill(blog.author)

  const inputUrl = await page.getByRole('textbox',{ name: 'url' })
  await inputUrl.waitFor({ state: 'visible', timeout: 10000 })
  await inputUrl.fill(blog.url)

  await page.getByRole('button', { name: 'create' }).click()
  const blogLink = page.locator('a.blog_row').filter({ hasText: blog.title })
  await blogLink.waitFor({ state: 'visible', timeout: 10000 })
}

test.describe('before login - login page', () => {

  test.beforeEach(async ({ page }) => {
    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173/login')
  })


  test('page title is correct', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Full Stack Open - part 11')
  })

  test('top menu label is correct', async ({ page }) => {
    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu).toContainText('blogs')
    await expect(topMenu).toContainText('login')
  })

  test('header is correct', async ({ page }) => {
    await expect(page.getByRole('heading',
      { name: 'log in to application' })).toBeVisible()
  })

  test('input box to have label', async ({ page }) => {
    await expect(page.getByRole('textbox',
      { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox',
      { name: 'password' })).toBeVisible()
  })

  test('button label is correct', async ({ page }) => {
    await expect(page.getByRole('button',
      { name: 'login' })).toBeVisible()
  })
})  // end of test.describe

test.describe('before login - blog page', () => {

  test('top menu label is correct - before login', async ({ page }) => {

    console.log(`running: ${test.info().title}`)

    await page.goto('http://localhost:5173/login')
    await expect(page.getByRole('heading', { name: /log in to application/i })).toBeVisible()

    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu).toContainText('blogs')
    await expect(topMenu).toContainText('login')
  })

  test('blog contents are correct - before login', async ({ page, request }) => {

    console.log(`running: ${test.info().title}`)

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', { data: testUsers[0] })

    await page.goto('http://localhost:5173/login')
    await expect(page.getByRole('heading', { name: /log in to application/i })).toBeVisible()

    // login and create blogs for preparing test data
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    for (const blog of testBlogs) {
      await createBlog(page, blog)
    }

    // logout and fall back to login page
    await page.getByRole('button', { name: 'logout' }).click()
    await expect(page.getByRole('heading', { name: /log in to application/i })).toBeVisible()

    // go to blog list page to verify correctness of blog details
    await page.getByRole('link', { name: 'blogs' }).click()
    await expect(page.getByRole('heading', { name: /blogs/i })).toBeVisible()

    for (const blog of testBlogs) {
      const blogLink = page.
        getByRole('link', { name:`${blog.title} by ${blog.author}` } )
      await expect(blogLink).toBeVisible()
      await blogLink.click()

      await expect(page.getByTestId('blogTitle')).toContainText(blog.title)
      await expect(page.getByTestId('blogAuthor')).toContainText(blog.author)

      await expect(page.locator(`text=${blog.url}`)).toBeVisible()
      await expect(page.locator('text=0 likes')).toBeVisible()
      await expect(page.locator(`text=Added by ${blog.author}`)).toBeVisible()

      await expect(page.getByRole('button', { name: 'like' } )).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

      await page.locator('#blogsLink').click()
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

  })

  test('after login top menu label is correct', async ({ page }) => {
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu).toContainText('blogs')
    await expect(topMenu).toContainText('new blog')
    await page.waitForURL(url => url.pathname === '/')
    await expect(topMenu.getByRole('button', { name: 'logout' })).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'invalid_username', 'invalid_password')

    const topMenu = page.getByTestId('nav-bar')
    await expect(topMenu.getByRole('button', { name: 'logout' })).not.toBeVisible()

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
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    for (const blog of testBlogs) {
      await createBlog(page, blog)
    }

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')

  }) // end of beforeEach

  test('created blogs are correct', async ({ page }) => {

    for (const blog of testBlogs) {
      const blogLink = page.
        getByRole('link', { name:`${blog.title} by ${blog.author}` } )
      await expect(blogLink).toBeVisible()
      await blogLink.click()

      await expect(page.getByTestId('blogTitle')).toContainText(blog.title)
      await expect(page.getByTestId('blogAuthor')).toContainText(blog.author)

      await expect(page.locator(`text=${blog.url}`)).toBeVisible()
      await expect(page.locator('text=0 likes')).toBeVisible()
      await expect(page.locator(`text=Added by ${blog.author}`)).toBeVisible()

      await expect(page.getByRole('button', { name: 'like' } )).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.locator('#blogsLink').click()
      await page.waitForURL(url => url.pathname === '/')
    }
  })

  test('show success notification when new blog created', async ({ page }) => {

    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Canny Har',
      url: 'http://www.canny.hk', }

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


  test('logged-in user can like blogs', async ({ page }) => {

    // click 'Mosquito Bites by Michael Chan'
    await page
      .getByRole('link',
        { name:`${testBlogs[0].title} by ${testBlogs[0].author}` } )
      .click()

    await expect(page.getByTestId('blogTitle')).toContainText(testBlogs[0].title)
    await expect(page.getByTestId('blogAuthor')).toContainText(testBlogs[0].author)

    const initLikes = parseInt(await page.getByTestId('numLikes').innerText(), 10)

    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByTestId('numLikes')).toContainText(`${initLikes + 1}`)
  })

  test('logged-in user can delete blogs', async ({ page }) => {

    // click 'Mosquito Bites by Michael Chan'
    await page
      .getByRole('link',
        { name:`${testBlogs[0].title} by ${testBlogs[0].author}` } )
      .click()

    await page.waitForLoadState('domcontentloaded')

    await expect(page.getByTestId('blogTitle')).toContainText(testBlogs[0].title)
    await expect(page.getByTestId('blogAuthor')).toContainText(testBlogs[0].author)

    // setup listener FIRST dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe(`Remove blog: ${testBlogs[0].title} by ${testBlogs[0].author} ?`)
      expect(dialog.type()).toBe('confirm')
      await dialog.accept() // accepts the confirm window
    })

    await page.getByRole('button', { name: 'remove' }).click()
    await page.waitForURL(url => url.pathname === '/')

    await expect(page
      .getByRole('link', { name:`${testBlogs[0].title} by ${testBlogs[0].author}` } ))
      .not.toBeVisible()

  })
})  // end of test.describe


test.describe('after login - blog page - logged in user != author', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    // Create two users 'root' and 'canny'
    await request.post('http://localhost:3003/api/users', { data: testUsers[0] })
    await request.post('http://localhost:3003/api/users', { data: testUsers[1] })

    // Log in as 'root' to create a blog post
    await page.goto('http://localhost:5173/login')
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    await createBlog(page, testBlogs[0])

    // Log out 'root'
    await page.getByRole('button', { name: 'logout' }).click()
    await page.waitForURL(/\/login$/)

    // Log in as 'canny'
    await loginWith(page, testUsers[1].username, testUsers[1].password)
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  })

  test('non-author sees like button but remove button is hidden', async ({ page }) => {
    // Navigate to blog post created by 'root'
    await page
      .getByRole('link', { name: `${testBlogs[0].title} by ${testBlogs[0].author}` })
      .click()
    await page.waitForURL(/\/blogs\//)

    // Verify button visibilities for non-author
    await expect(page.getByTestId('blogTitle')).toContainText(testBlogs[0].title)
    await expect(page.getByTestId('blogAuthor')).toContainText(testBlogs[0].author)

    await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })

})