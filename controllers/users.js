// Full Stack open, The University of Helsinki
// Exercises 4.15 - 4.23 Blog List Expansion
// Url : https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23
// Created on 2026-07-20 22:06 HKT

// Change log :
// 1. exercise 4.15: Blog List Expansion, step 3 (July 20, 2026)
//    ->  create new users by HTTP POST
// 2. exercise 4.16: Blog List Expansion, step 4 (July 24, 2026)
//    ->  test restrictions to username and password
// 3. exercise 4.17: Blog List Expansion, step 5 (July 25, 2026)
//    ->  implement popular method


const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// exercise 4.17: add popular()
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})


usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  if (password) {
    if (password.length >=3) {

      try {

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
          username,
          name,
          passwordHash
        })

        const result = await user.save()
        response.status(201).json(result)
      } catch(error) {
        next(error) // Pass to error handler middleware
      }
    } else {
      response
        .status(400)
        .json({ error: 'Error: password validation fails.' })
    }
  } else {
    response
      .status(400)
      .json({ error: 'Error: password is missing.' })
  }
})



usersRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const deletedUser = await User.findByIdAndDelete(id)
    if (deletedUser) {
      response.statusMessage = `Success: id = ${id} is deleted.`
      response.status(204).end()
    } else {
      // return null -> id format ok but record not found
      response
        .status(404)
        .json({ error: `Error: id = ${id} cannot be found.` })
    }
  } catch (error) {
    next(error)
  }
})


module.exports = usersRouter

