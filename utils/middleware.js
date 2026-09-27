// Full Stack open, The University of Helsinki
// Exercises 4.15 - 4.23 Blog List Expansion
// Url : https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23
// Created on 2026-08-01 08:52 HKT

// Change log :
// 1. exercise 4.20: Blog List Expansion, step 8 (Aug 1, 2026)
//    -> refactor taking token to a middleware
// 2. exercise 4.22: Blog List Expansion, step 10 (Aug 11, 2026)
//    -> create new middleware 'userExtractor' identifies user

const User = require('../models/user')
const jwt = require('jsonwebtoken')


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    // Isolate the raw token string by removing 'Bearer ' prefix
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response
        .status(400)
        .json({ error: 'No user in database to link' })
    }
    request.user = user
    next()

  } catch (error) {
    next(error)
  }


}


module.exports = { tokenExtractor, userExtractor }
