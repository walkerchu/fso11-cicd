// Full Stack open, The University of Helsinki
// Exercises 5.17 - 5.23 Blog List End To End Testing
// Url : https://fullstackopen.com/en/part5/end_to_end_testing#exercises-5-17-5-23
// Created on 2026-09-12 14:32 HKT

// Change log :
// 1. exercise 5.18: Blog List End To End Testing, step 2 (Sept 12, 2026)
//    -> create login helper function
// 2. exercise 5.19: Blog List End To End Testing, step 3 (Sept 12, 2026)
//    -> create create blog helper function


const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByRole('textbox',{ name: 'title' }).fill(blog.title)
  await page.getByRole('textbox',{ name: 'author' }).fill(blog.author)
  await page.getByRole('textbox',{ name: 'url' }).fill(blog.url)

  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('.blog_row').filter({ hasText: `${blog.title}` }).waitFor()
}

export { loginWith, createBlog }