// Full Stack open, The University of Helsinki
// Exercises 4.15 - 4.23 Blog List Expansion
// Url : https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23
// Created on 2026-07-20 22:53 HKT

// Change log :
// 1. exercise 4.15: Blog List Expansion, step 3 (July 20, 2026)
//    -> define user model
// 2. exercise 4.16: Blog List Expansion, step 4 (July 24, 2026)
//    -> add restrictions to username and password
// 3. exercise 4.17: Blog List Expansion, step 5 (July 25, 2026)
//    ->  implement popular method

const mongoose = require('mongoose')

// exercise 4.17: 'blogs' references to the Blog model.
const userSchema = new mongoose.Schema({
  username: { type: String, minLength: 3, required: true, unique: true },
  name: String,
  passwordHash:  { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,  // unique MongoDB identifier
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)


