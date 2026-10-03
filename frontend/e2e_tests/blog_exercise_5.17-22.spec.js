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

// REMARK :
// as this file growing too big, exercise 5.23 is
// coded in separated test file 'exercise_5_23.spec.js'

import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper-func'

// exercise 5.17: login page is displayed by default
test.describe('test for exercise 5.17', () => {

  test.beforeEach(async ({ page }) => {
    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  test('page title is correct', async ({ page }) => {
    const title = await page.title()
    expect(title).toBe('Full Stack Open - part 11')
  })

  test('header is correct', async ({ page }) => {
    await expect(page.getByRole('heading',
      { name: 'blogs' })).toBeVisible()
  })

  // exercise 11.21: skip as UI moved to '/login'
  test.skip('input box to have label', async ({ page }) => {
    await expect(page.getByRole('textbox',
      { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox',
      { name: 'password' })).toBeVisible()
  })

  // exercise 11.21: skip as UI moved to '/login'
  test.skip('button label is correct', async ({ page }) => {
    await expect(page.getByRole('button',
      { name: 'login' })).toBeVisible()
  })
})

// exercise 5.18: test successful and failed login
// exercise 11.21: skip as UI moved to '/login'
test.describe.skip('test for exercise 5.18', () => {

  const testData = {
    name: 'Michael Chan',
    username: 'root',
    password: 'secret'
  }

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: testData
    })


    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, testData.username, testData.password)
    await expect(page.getByText(`${testData.name} logged in`)).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'invalid_username', 'invalid_password')

    await expect(page.getByText('logged in')).not.toBeVisible()

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('color', 'rgb(191, 23, 34)') // font colour
    await expect(errorDiv).toHaveCSS('border-color', 'rgb(191, 23, 34)')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')

    // Give a 1000ms buffer to account for hardware/execution variance
    await expect(errorDiv).toBeHidden({ timeout: 6000 })
  })

  test('fails with empty credentials', async ({ page }) => {

    // enter nothing and click "login" button
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
  })
})

// exercise 5.19: verify logged user can create blog
// exercise 11.21: skip as UI moved to '/login'
test.describe.skip('test for exercise 5.19', () => {

  const testUser = {
    name: 'Canny Har',
    username: 'canny',
    password: 'har'
  }

  const testBlogs =[
    { title: 'Canonical string reduction 5', author: 'Canny Har', url: 'http://www.canny.hk', },
    { title: 'The Seagulls Woke Me', author: 'Canny Har', url: 'http://www.canny.org', },
    { title: 'The Preserving Machine', author: 'Michael Chan', url: 'http://www.michael.edu', },
  ]


  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: testUser
    })

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  test('logged user create blog', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByText(`${testUser.name} logged in`)).toBeVisible()
    await createBlog(page, testBlogs[0])

    const successDiv = page.locator('.success')
    await expect(successDiv)
      .toContainText(`a new blog ${testBlogs[0].title} by ${testBlogs[0].author} added`)
    await expect(successDiv).toHaveCSS('color', 'rgb(51, 153, 0)') // font colour
    await expect(successDiv).toHaveCSS('border-color', 'rgb(51, 153, 0)')
    await expect(successDiv).toHaveCSS('border-style', 'solid')

    // Give a 1000ms buffer to account for hardware/execution variance
    await expect(successDiv).toBeHidden({ timeout: 6000 })

    const blogRows = page.locator('.blog_row')
      .filter({ hasText: testBlogs[0].title })
    await expect(blogRows).toContainText(testBlogs[0].author)
  })

  test('can create multipe blogs', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByText(`${testUser.name} logged in`)).toBeVisible()

    // insert multipe blog records
    for (let i=0; i<testBlogs.length; i++) {
      await createBlog(page, testBlogs[i])
    }

    for (let j=0; j<testBlogs.length; j++) {
      let blogRows = page.locator('.blog_row')
        .filter({ hasText: testBlogs[j].title })
      await expect(blogRows).toContainText(testBlogs[j].author)
    }
  })
})

// exercise 5.20: verify blog can be liked
test.describe('test for exercise 5.20', () => {

  const testUser = {
    name: 'Michael Chan',
    username: 'michael',
    password: 'chan',
  }

  const testBlog = {
    title: 'The Preserving Machine',
    author: 'Michael Chan',
    url: 'http://www.michael.edu',
  }

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: testUser
    })

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  // exercise 11.21: rewrite the test as 'create' form is moved
  test('blog can be liked after login', async ({ page }) => {

    await page.getByRole('link', { name: /login/i }).click()
    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
    await createBlog(page, testBlog)

    await page.getByRole('link',
      { name: new RegExp(`${testBlog.title} by ${testBlog.author}`, 'i') }).click()

    const likesLocator = page.getByTestId('numLikes')
    await expect(likesLocator).toBeVisible()

    const likesText = await likesLocator.textContent()
    const initLikes = parseInt(likesText ?? 'NaN', 10)

    expect(Number.isNaN(initLikes)).toBe(false)
    expect(initLikes).toBeGreaterThanOrEqual(0)

    await page.getByRole('button', { name: /like/i }).click()
    await expect(likesLocator).toHaveText(String(initLikes + 1))
  })

  // exercise 11.21: add new test for before login section
  test('no like button if does not login', async ({ page }) => {
    await page.getByRole('link', { name: /login/i }).click()
    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
    await createBlog(page, testBlog)  // create new blog
    await page.getByRole('button', { name: /logout/i }).click() // logout

    // assert landing on login page after logout
    await expect(page).toHaveURL(new RegExp('/login', 'i'))

    await page.getByRole('link', { name: /blogs/i }).click()
    await page.getByRole('link', { name: new RegExp(testBlog.title, 'i') }).click()
    await expect(page.getByRole('button', { name: /like/i })).toBeHidden()
  })
})


// exercise 5.21: verify user who added blog can delete blog
test.describe('test for exercise 5.21', () => {

  const testUser = {
    name: 'Michael Chan',
    username: 'michael',
    password: 'chan',
  }

  const testBlog = {
    title: 'Under the Bleachers',
    author: 'Michael Chan',
    url: 'http://www.michaelchan.edu',
  }

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: testUser
    })

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173')
  })

  // exercise 11.21: modified to accommodate Material UI
  test('blog creator can delete blog', async ({ page }) => {

    // login and create new blog
    await page.getByRole('link', { name: /login/i }).click()
    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
    await createBlog(page, testBlog)

    // go to blog details page and verify title correct
    await page.getByRole('link',
      { name: new RegExp(`${testBlog.title} by ${testBlog.author}`, 'i') }).click()
    await expect(page.getByTestId('blogTitle')).toContainText(testBlog.title)

    // setup listener FIRST dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe(`Remove blog: ${testBlog.title} by ${testUser.name} ?`)
      expect(dialog.type()).toBe('confirm')
      await dialog.accept() // accepts the confirm window
    })

    await page.getByRole('button', { name: /remove/i }).click()

    await expect(page.getByText('blogs')).toBeVisible()
    await expect(page.getByRole('link',
      { name: new RegExp(`${testBlog.title} by ${testBlog.author}`, 'i') }))
      .toBeHidden()
  })
})


//exercise 5.22: verify only user who added blog can see delete button
test.describe('test for exercise 5.22', () => {

  const testUsers = [
    { name: 'Michael Chan', username: 'michael', password: 'chan', },
    { name: 'Canny Har', username: 'canny',password: 'har', }
  ]

  const testBlogs = [
    { title: 'Mosquito Bites', author: 'Michael Chan', url: 'http://www.mosquito.com', },
    { title: 'Cooking Past', author: 'Michael Chan', url: 'http://www.cooking.com', },
  ]

  test.beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')

    // create two users
    for (let i=0; i<testUsers.length; i++) {
      await request.post('http://localhost:3003/api/users', { data: testUsers[i] })
    }

    console.log(`running: ${test.info().title}`)
    await page.goto('http://localhost:5173/login')  // login page
  })

  test('only blog-creator can see delete button', async ({ page }) => {

    // 1st user login and create two blogs
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

    for (let j=0; j<testBlogs.length; j++) {
      await createBlog(page, testBlogs[j])
    }

    // assert all blogs have successfully inserted
    await expect(page.locator('a.blog_row')).toHaveCount(testBlogs.length)

    // verify creator (1st user) can see remove button
    for (const blog of testBlogs) {

      // click the respective blog link to land on details page
      const blogLink = page.locator('a.blog_row').filter({ hasText: blog.title })
      await blogLink.click()

      // wait for the URL path to change to the details page route
      await page.waitForURL('**/blogs/**')

      // confirm land on the correct page by assert the blog.title
      const newBlogTitle = page.getByTestId('blogTitle').filter({ hasText: blog.title })
      await expect(newBlogTitle).toBeVisible({ timeout: 10000 })

      // assert the "remove" button is visible
      await expect(page.getByRole('button', { name: /remove/i })).toBeVisible()

      // click 'blogs' menu link and back to blog list page
      await page.getByRole('link', { name: 'blogs' }).click()
      await page.waitForURL(url => url.pathname === '/')
    }

    // 1st user logout and login 2nd user
    await page.getByRole('button', { name: 'logout' }).click()
    await loginWith(page, testUsers[1].username, testUsers[1].password)
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

    // verify non-creator (2nd user) cannot see remove button
    for (const blog of testBlogs) {

      const blogLink = page.locator('a.blog_row').filter({ hasText: blog.title })
      await blogLink.click()

      await page.waitForURL('**/blogs/**')

      const newBlogTitle = page.getByTestId('blogTitle').filter({ hasText: blog.title })
      await expect(newBlogTitle).toBeVisible({ timeout: 10000 })

      await expect(page.getByRole('button', { name: /remove/i })).not.toBeVisible()
      await page.getByRole('link', { name: 'blogs' }).click()
      await page.waitForURL(url => url.pathname === '/')
    }
  })
})

