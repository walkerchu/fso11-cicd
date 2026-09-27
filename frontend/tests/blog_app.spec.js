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
    expect(title).toBe('Full Stack open - part 5')
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
})

// exercise 5.18: test successful and failed login
test.describe('test for exercise 5.18', () => {

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
test.describe('test for exercise 5.19', () => {

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
    username: 'root',
    password: 'secret',
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

  test('blog can be liked and increase 1', async ({ page }) => {

    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByText(`${testUser.name} logged in`)).toBeVisible()
    await createBlog(page, testBlog)

    const blogRow = page.locator('div.blog_row').filter({ hasText: testBlog.title }).first()

    await blogRow.getByRole('button', { name: 'view' }).click()
    await expect(blogRow.getByRole('button', { name: 'hide' })).toBeVisible()

    const blogDetails = blogRow.locator('xpath=following-sibling::div[1]')

    const likesText = (await blogDetails.locator('#numLikes').innerText()).match(/\d+/)
    const initLikes = parseInt(likesText?.[0] ?? 'NaN', 10)
    expect(Number.isNaN(initLikes)).toBe(false)
    expect(initLikes).toBeGreaterThanOrEqual(0)

    await blogDetails.locator('#likeButton').click()
    await expect(blogDetails).toContainText(`likes ${initLikes+1}`)

  })
})

//exercise 5.21: verify user who added blog can delete blog
test.describe('test for exercise 5.21', () => {

  const testUser = {
    name: 'Michael Chan',
    username: 'root',
    password: 'secret',
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

  test('blog creator can delete blog', async ({ page }) => {

    await loginWith(page, testUser.username, testUser.password)
    await expect(page.getByText(`${testUser.name} logged in`)).toBeVisible()
    await createBlog(page, testBlog)

    const blogRow = page.locator('div.blog_row').filter({ hasText: testBlog.title }).first()
    await blogRow.getByRole('button', { name: 'view' }).click()

    const blogDetails = blogRow.locator('xpath=following-sibling::div[1]')
    const removeButton = blogDetails.getByRole('button', { name: 'remove' })
    await expect(removeButton).toBeVisible()

    // setup listener FIRST dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe(`Remove blog: ${testBlog.title} by ${testUser.name} ?`)
      expect(dialog.type()).toBe('confirm')
      await dialog.accept() // accepts the confirm window
    })

    await removeButton.click()
    await expect(blogRow).toBeHidden()
    await expect(blogDetails).toBeHidden()
  })

})


//exercise 5.22: verify only user who added blog can see delete button
test.describe('test for exercise 5.22', () => {

  const testUsers = [
    { name: 'Michael Chan', username: 'root', password: 'secret', },
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
    await page.goto('http://localhost:5173')
  })

  test('only blog-creator can see delete button', async ({ page }) => {

    // 1st user login and create two blogs
    await loginWith(page, testUsers[0].username, testUsers[0].password)
    await expect(page.getByText(`${testUsers[0].name} logged in`)).toBeVisible()

    for (let j=0; j<testBlogs.length; j++) {
      await createBlog(page, testBlogs[j])
    }

    // assert blogs have successfully inserted
    await expect(page.locator('div.blog_row')).toHaveCount(testBlogs.length)

    // verify creator (1st user) can see remove button
    for (const blog of testBlogs) {
      const blogRow = page.locator('div.blog_row').filter({ hasText: blog.title }).first()
      await blogRow.getByRole('button', { name: 'view' }).click()

      const blogDetails = blogRow.locator('xpath=following-sibling::div[1]')
      await expect(blogDetails.getByRole('button', { name: 'remove' })).toBeVisible()
      await blogRow.getByRole('button', { name: 'hide' }).click() // reset state cleanly
    }

    // 1st user logout and login 2nd user
    await page.getByRole('button', { name: 'logout' }).click()
    await loginWith(page, testUsers[1].username, testUsers[1].password)
    await expect(page.getByText(`${testUsers[1].name} logged in`)).toBeVisible()

    // verify non-creator (2nd user) can see remove button
    for (const blog of testBlogs) {
      const blogRow = page.locator('div.blog_row').filter({ hasText: blog.title }).first()
      await blogRow.getByRole('button', { name: 'view' }).click()

      const blogDetails = blogRow.locator('xpath=following-sibling::div[1]')
      await expect(blogDetails.getByRole('button', { name: 'remove' })).not.toBeVisible()
      await blogRow.getByRole('button', { name: 'hide' }).click()
    }
  })
})



