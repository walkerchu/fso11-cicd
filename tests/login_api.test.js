// Full Stack open, The University of Helsinki
// Exercises 4.15 - 4.23 Blog List Expansion
// Url : https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23
// Created on 2026-08-01 11:04 HKT

// Change log :
// 1. exercise 4.18: Blog List Expansion, step 6 (July 29, 2026)
// 2. exercise 4.19: Blog List Expansion, step 7 (July 29, 2026)
// 3. exercise 4.20: Blog List Expansion, step 8 (Aug 1, 2026)
//    -> implement token-based authentication

const { test, beforeEach, before, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)


before(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', name: 'System Admin', passwordHash })
  await user.save()
})

describe('1. create token', () => {

  let response = null

  beforeEach(async () => {
    response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })
      .expect(200)
  })

  // Test 1: create token successful
  test('1.1 valid user can get token', async () => {
    assert.strictEqual(response.statusCode, 200)
    assert.ok(response.headers['content-type']
      .includes('application/json'))
  })

  // Test 2: returned record is valid
  test('1.2 returned record is valid', async () => {
    const keys = Object.keys(response.body)
    assert.strictEqual(keys.length, 3)
    assert.ok(keys.includes('token'))
    assert.ok(keys.includes('username'))
    assert.ok(keys.includes('name'))
    assert.strictEqual(typeof response.body.token, 'string')
    assert.strictEqual(typeof response.body.username, 'string')
    assert.strictEqual(typeof response.body.name, 'string')
  })
})

describe('2. get token by invalid info', () => {

  test('2.1 invalid username', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'invalid', password: 'secret' })
    assert.strictEqual(response.statusCode, 401)
    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('2.2 invalid password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'invalid' })
    assert.strictEqual(response.statusCode, 401)
    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('2.3 invalid username/password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'invalid', password: 'invalid' })
    assert.strictEqual(response.statusCode, 401)
    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('2.4 missing username', async () => {
    const response = await api
      .post('/api/login')
      .send({ password: 'secret' })
    assert.strictEqual(response.statusCode, 401)
    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('2.5 missing password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root' })
    assert.strictEqual(response.statusCode, 401)
    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('2.6 empty username/password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username:'', password:'' })
    assert.strictEqual(response.statusCode, 401)
    assert.strictEqual(response.body.error, 'invalid username or password')
  })
})


after(async () => {
  await mongoose.connection.close()
})