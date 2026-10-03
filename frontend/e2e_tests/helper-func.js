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


const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.waitForURL('**/create')
  const createPageHeader = page.locator('h3', 'create new')
  await createPageHeader.waitFor({ state: 'visible', timeout: 10000 })

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

export { loginWith, createBlog }