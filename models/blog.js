// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Phonebook backend
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-15 23:33 HKT

// Change log :
// 1. exercise 4.1: Blog List, step 1 (July 16, 2026)
//    -> turn into a functioning npm project.
// 2. exercise 4.2: Blog List, step 2 (July 16, 2026)
//    -> refactor into separate modules.
// 3. exercise 4.11: Blog List Tests, step 4 (July 19, 2026)
//    ->  missing likes property will set default to 0
// 4. exercise 4.12: Blog List Tests, step 5 (July 19, 2026)
//    ->  thorw error if title or url properties are missing
// 5. exercise 4.17: Blog List Expansion, step 5 (July 25, 2026)
//    ->  implement popular method

const mongoose = require('mongoose')

// exercise 4.17: 'user' references to the User model.
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true }, // field required
  author: String,
  url: { type: String, required: true }, // field required
  likes: { type: Number, default: 0 }, // default: 0
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})


module.exports = mongoose.model('Blog', blogSchema)