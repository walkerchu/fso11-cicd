// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Blog List
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-14 02:56 HKT

// Change log :
// 1. Exercise 4.1: Blog List, step 1 (July 14, 2026)
//    -> Turn application into a functioning npm project
// 2. Exercise 4.2: Blog List, step 2 (July 14, 2026)
//    -> Refactor application into separate modules
// 3. exercise 4.8: Blog List Tests, step 1 (July 18, 2026)
//    -> use async/await syntax instead of promises
// 4. exercise 4.15: Blog List Expansion, step 3 (July 20, 2026)
//    -> add usersRouter to handles /api/users request
// 5. exercise 4.16: Blog List Expansion, step 4 (July 24, 2026)
//    -> test restrictions to username and password
// 6. exercise 4.18: Blog List Expansion, step 6 (July 29, 2026)
//    -> implement token-based authentication
// 7. exercise 4.20: Blog List Expansion, step 8 (Aug 1, 2026)
//    -> refactor taking token to a middleware
// 8. exercise 5.18: Blog List End To End Testing, step 2 (Sept 12, 2026)
//    -> register testing router only if env is 'test'
// 9. exercise 11.21 (Sept 30, 2026)
//    -> remove app.get('/') and replace with static middleware

const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

const cors = require('cors') // Node's cors middleware
app.use(cors()) // to use cors middleware
app.use(express.json()) //activate the json-parser

// Workaround for resolve SRV records failure
// by using CommonJS (require)
const dns = require('node:dns/promises')
dns.setServers(['1.1.1.1', '8.8.8.8'])

// Exercise 4.20: register token middleware before all routers
const middleware = require('./utils/middleware')
app.use(middleware.tokenExtractor)

// Exercise 4.18: add new router 'login'
const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

// exercise 4.8: use async/await syntax instead of promises.
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('Connected to MongoDB at', Date())
  } catch(err) {
    logger.error('Connection Error and Exit:')
    logger.error('- error code:', err.code)
    logger.error('- error message:', err.errmsg)
    logger.error('- time:', Date())
    process.exit(1) }
}
connectDB()


// Exercise 11.21: replace app.get('/') by static middleware:
app.use(express.static('frontend/dist'))


// Exercise 11.21 : Health check endpoint for Render deployment checks
app.get('/health', (req, res) => {
  res.send('ok')
})

// Exercise 4.15: Site -> <baseURL>:3003/api/users
app.use('/api/users', usersRouter)


// Site : <baseURL>:3003/api/blogs
app.use('/api/blogs', blogsRouter)

// exercise 5.18 :
// conditionally register testing router under /api/testing
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}


// error handler middleware
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') { // exercise 4.19
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error) // default handler
}
app.use(errorHandler) // the last loaded middleware.

module.exports = app


