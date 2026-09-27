// Full Stack open, The University of Helsinki
// Exercises 4.15 - 4.23 Blog List Expansion
// Url : https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23
// Created on 2026-07-21 01:09 HKT

// Change log :
// 1. exercise 4.15: Blog List Expansion, step 3 (July 20, 2026)
//    -> create new users by HTTP POST
// 2. exercise 4.16: Blog List Expansion, step 4 (July 24, 2026)
//    -> test restrictions to username and password


const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const data = require('./test_data')
const api = supertest(app)

const bcrypt = require('bcrypt')

// clear test DB and add starting record before test

// beforeEach(async () => {
//   await User.deleteMany({})
//   const userObject = new User(data.initialUsers[0])
//   await userObject.save()
// })

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create 1 initial user so `User.findOne({})` in your blog POST route works
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'System Admin',
    passwordHash })
  await user.save()
})


describe('user data format is correct', () => {

  test('returned data is json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('data fields are corrected', async () => {
    const response = await api.get('/api/users')
    const jsonKeys = Object.keys(response.body[0])
    assert.ok(jsonKeys.includes('username'), 'include username')
    assert.ok(jsonKeys.includes('name'), 'include name')
    assert.ok(jsonKeys.includes('blogs'), 'include blogs')
    assert.ok(jsonKeys.includes('id'), 'include id')
  })

  test('userSchema.set correctly remove fields', async () => {
    const response = await api.get('/api/users')
    const jsonKeys = Object.keys(response.body[0])
    assert.ok(!jsonKeys.includes('_id'), 'not return _id')
    assert.ok(!jsonKeys.includes('__v'), 'not return __v')
    assert.ok(!jsonKeys.includes('passwordHash'), 'not return passwordHash')
  })

  test('data fields type is correct', async () => {
    const response = await api.get('/api/users')
    const user = response.body[0]
    assert.strictEqual(typeof user.username, 'string', 'username is string')
    assert.strictEqual(typeof user.name, 'string', 'name is string')
    assert.strictEqual(Array.isArray(user.blogs), true, 'blogs is list')
    assert.strictEqual(typeof user.id, 'string', 'id is string')
  })

  test('returned user data is correct', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body[0].username, data.initialUsers[0].username)
    assert.strictEqual(response.body[0].name, data.initialUsers[0].name)
  })
})

describe('add single user by POST', () => {

  test('new user saved correctly', async () => {

    const beforeResponse = await api.get('/api/users')
    const beforeBlogsLength = beforeResponse.body.length

    // create a new blog post
    const savedUser = await api
      .post('/api/users')
      .send(data.initialUsers[1])

    // retrieve DB records after creating a new blog
    const afterResponse = await api.get('/api/users')

    // find the saved blog from retrieved records
    const insertedUser = afterResponse.body.find(
      s => s.id === savedUser.body.id)

    assert.strictEqual(afterResponse.body.length, beforeBlogsLength + 1)
    assert.deepStrictEqual(insertedUser, savedUser.body)
  })
})

describe('delete user by DELETE', () => {

  test('return status 204 if valid id', async () => {
    // Fetch new user to pick a target user to delete
    const usersAtStart = await api.get('/api/users')
    const userToDelete = usersAtStart.body[0]

    // Perform DELETE request
    await api
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204)

    // Fetch users after deletion
    const usersAtEnd = await api.get('/api/users')

    // Assertion 1: Total user count decreased by 1
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length - 1)

    // Assertion 2: The deleted user's username is no longer in the list
    const usernames = usersAtEnd.body.map(u => u.username)
    assert.ok(!usernames.includes(userToDelete.username), 'deleted user should not exist in returned list')
  })

  test('return status 404 if user does not exist', async () => {
    // Generate a valid MongoDB ObjectId format that doesn't exist in DB
    const validNonExistingId = new mongoose.Types.ObjectId().toString()

    const response = await api
      .delete(`/api/users/${validNonExistingId}`)
      .expect(404)

    // Assert returned error message
    assert.strictEqual(response.body.error, `Error: id = ${validNonExistingId} cannot be found.`)
  })

  test('fails with status 400 if id malformatted', async () => {
    const invalidId = '12345invalidid'

    const response = await api
      .delete(`/api/users/${invalidId}`)
      .expect(400)

    // Assert error handler caught the CastError
    assert.strictEqual(response.body.error, 'malformatted id')
  })

})

describe('create user with invalid name', () => {

  test('no username expects 400', async () => {
    const response = await api
      .post('/api/users')
      .send(data.invalidUsers.missingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error,
      'User validation failed: username: Path `username` is required.')
  })

  test('short username expects 400', async () => {
    const response = await api
      .post('/api/users')
      .send(data.invalidUsers.shortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes(
      'User validation failed: username: Path `username`'))
  })

  test('username is unique', async () => {
    const getResponse = await api.get('/api/users')

    const newUser =  {
      username: getResponse.body[0].username,
      name: getResponse.body[0].name,
      password: 'any_value'
    }

    const postResponse = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(postResponse.body.error,'expected `username` to be unique')
  })
})

describe('create user with invalid password', () => {

  test('no password expects 400', async () => {
    const response = await api
      .post('/api/users')
      .send(data.invalidUsers.missingPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error,
      'Error: password is missing.')
  })

  test('short password expects 400', async () => {
    const response = await api
      .post('/api/users')
      .send(data.invalidUsers.shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error,
      'Error: password validation fails.')
  })

  test('short password is not saved', async () => {
    const usersAtStart = await api.get('/api/users')

    await api
      .post('/api/users')
      .send(data.invalidUsers.shortPassword)
      .expect(400)

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
  })

})

after(async () => {
  await mongoose.connection.close()
})