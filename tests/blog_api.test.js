// Full Stack open, The University of Helsinki
// Exercises 4.8 - 4.12 Blog List Tests
// Url : https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12
// Created on 2026-07-18 14:22 HKT

// Change log :
// 1. exercise 4.8: Blog List Tests, step 1 (July 18, 2026)
//    -> use SuperTest library for writing a test
// 2. exercise 4.9: Blog List Tests, step 2 (July 19, 2026)
//    -> verifies unique identifier property is named id
// 3. exercise 4.10: Blog List Tests, step 3 (July 19, 2026)
//    -> successfully creates a new blog post
// 4. exercise 4.11: Blog List Tests, step 4 (July 19, 2026)
//    -> missing likes property will set default to 0
// 5. exercise 4.12: Blog List Tests, step 5 (July 19, 2026)
//    -> thorw error if title or url properties are missing
// 6. exercise 4.20: Blog List Expansion, step 8 (Aug 1, 2026)
//    -> repair POST as token is needed
// 7. exercise 4.21: Blog List Expansion, step 9 (Aug 6, 2026)
//    -> blog can be deleted only by user who added it
// 8. exercise 4.23: Blog List Expansion, step 11 (Aug 12, 2026)
//    -> throw 401 error if add a blog fails


const { test, beforeEach, before, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const data = require('./test_data')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

let token = null

before(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', name: 'System Admin', passwordHash })
  await user.save()

  // obtain token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })

  token = loginResponse.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const user = await User.findOne({ username: 'root' })

  const blogObject = new Blog({
    ...data.initBlog[0],
    user: user._id
  })
  await blogObject.save()
})

// Test 1: return JSON
test('1. blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Test 2: have one blog in database
test('2. all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 1)
})

// Test 3: blog content is correct
test('3. returned blog is correct', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body[0].title, 'React patterns')
  assert.strictEqual(response.body[0].author, 'Michael Chan')
  assert.strictEqual(response.body[0].url, 'https://reactpatterns.com/')
  assert.strictEqual(response.body[0].likes, 7)
})

// Test 4: exercise 4.9 -> verifies identifier property is named id
test('4. identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  const jsonKeys = Object.keys(response.body[0])
  assert.ok(jsonKeys.includes('id'), 'expect \'id\' is property')
  assert.ok(!jsonKeys.includes('_id'), 'expect \'_id\' is not property')
})

// Test 5:
// exercise 4.10 -> successfully creates new blog post
// exercise 4.20 -> add 'obtain token' code
test('5. successfully creates new blog', async () => {

  // initialize
  const newBlog ={
    'title': 'Canonical string reduction 2',
    'author': 'Edsger W. Dijkstra',
    'url': 'http://www.cs.utexas.edu/dummy/dummy.html',
    'likes': 12,
  }
  const beforeResponse = await api.get('/api/blogs')
  const beforeBlogsLength = beforeResponse.body.length

  // create a new blog post
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // send token
    .send(newBlog)
    .expect(201)

  // retrieve DB records after creating a new blog
  const afterResponse = await api.get('/api/blogs')

  assert.strictEqual(afterResponse.body.length, beforeBlogsLength + 1)

  const titles = afterResponse.body.map(b => b.title)
  assert.ok(titles.includes('Canonical string reduction 2'))

})

// Test 6 :
// exercise 4.11 -> likes default set to 0
// exercise 4.20 -> add 'obtain token' code
test('6. likes default set to 0', async () => {

  // initialize
  const newBlog ={
    'title': 'Canonical string reduction 3',
    'author': 'Edsger W. Dijkstra',
    'url': 'http://www.cs.utexas.edu/placeholder.html',
  }

  // create a new blog post without likes
  const savedBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // send token
    .send(newBlog)

  const blog = await Blog.findById(savedBlog.body.id)
  assert.strictEqual(blog.likes, 0)
})


// Test 7: exercise 4.12 -> throw error if title or url are missing
describe('7. throw err if title/url missing', () => {

  // Test 7A : normal case and expect 201
  test('7A. normal case expect 201', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // send token
      .send(data.normalNewBlog)
      .expect(201)
  })

  // Test 7B : no title and expect 400
  test('7B. no title expect 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // send token
      .send(data.newBlogMissTitle)
      .expect(400)
  })

  // Test 7C : no url and expect 400
  test('7C. no url expect 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // send token
      .send(data.newBlogMissURL)
      .expect(400)
  })

  // Test 7D : no title and url. expect 400
  test('7D. no title/url. expect 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // send token
      .send(data.newBlogMissTitleURL)
      .expect(400)
  })
})


// Test 8: exercise 4.21 -> blog can be deleted only by user who added it
describe('8. blog can only be deleted by creator', () => {

  test('8A. creator can successfully delete the blog (204)', async () => {
  // 1. Create a blog with 'root' (uses token)
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Test Author',
      url: 'http://testurl.com'
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogID = response.body.id

    // 2. Delete with the same 'root' token
    await api
      .delete(`/api/blogs/${blogID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    // 3. Verify it's no longer in the DB
    const blogsAfter = await api.get('/api/blogs')
    const ids = blogsAfter.body.map(b => b.id)
    assert.ok(!ids.includes(blogID))
  })

  test('8B. 401 error if not deleted by creator', async () => {

    // initialize
    const newBlog ={
      'title': 'Canonical string reduction 6',
      'author': 'Edsger W. Dijkstra',
      'url': 'http://www.utexas.edu/blog6.html',
      'likes': 12,
    }

    // create a new blog post
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // send token
      .send(newBlog)
      .expect(201)

    const blogID = response.body.id // new blog id

    // set up non-creator user
    // user id:'root2' / name:'System Admin 2' / password = 'secret'
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root2', name: 'System Admin 2', passwordHash })
    await user.save()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root2', password: 'secret' })
    const nonCreatorToken = loginResponse.body.token

    // delete new blog by non-creator user
    const deleteResponse = await api
      .delete(`/api/blogs/${blogID}`)
      .set('Authorization', `Bearer ${nonCreatorToken}`) // send token
      .expect(401)

    // Assert returned error message
    assert.strictEqual(deleteResponse.body.error,
      `Error: unauthorized to delete blog id = ${blogID}.`)
  })

  // Exercise 4.23: throw 401 Unauthorized if token is missing
  test('8C. 401 error if token is not provided', async () => {

    // initialize
    const newBlog = {
      'title': 'Canonical string reduction 7',
      'author': 'Edsger W. Dijkstra',
      'url': 'http://www.utexas.edu/blog7.html',
      'likes': 13,
    }

    const beforeResponse = await api
      .get('/api/blogs')
      .expect(200)

    // create a new blog without .set('Authorization', ...)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const afterResponse = await api
      .get('/api/blogs')
      .expect(200)

    // Assert no new blog is added
    assert.strictEqual(afterResponse.body.length, beforeResponse.body.length)
  })

})


after(async () => {
  await mongoose.connection.close()
})