// Full Stack open, The University of Helsinki
// Exercises 4.15 - 4.23 Blog List Expansion
// Url : https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23
// Created on 2026-07-29 01:02 HKT

// Change log :
// 1. exercise 4.18: Blog List Expansion, step 6 (July 29, 2026)
//    -> implement token-based authentication
// 2. exercise 4.19: Blog List Expansion, step 7 (July 29, 2026)
//    -> add new blogs only if valid token is sent
// 3. exercise 4.20: Blog List Expansion, step 8 (Aug 1, 2026)
//    -> refactor taking token to a middleware



const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect = (user === null || !password)
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter