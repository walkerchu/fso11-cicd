// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Blog List
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-15 23:31 HKT

// Change log :
// 1. exercise 4.1: Blog List, step 1 (July 16, 2026)
//    -> turn into a functioning npm project.
// 2. exercise 4.2: Blog List, step 2 (July 16, 2026)
//    -> refactor into separate modules.
// 3. exercise 4.8: Blog List Tests, step 1 (July 18, 2026)
//    -> use async/await syntax instead of promises
// 4. exercise 4.13: Blog List Expansions, step 1 (July 19, 2026)
//    -> implement for deleting a single blog post.
// 5. exercise 4.14: Blog List Expansions, step 2 (July 19, 2026)
//    -> updating info of an individual blog post
// 6. exercise 4.17: Blog List Expansion, step 5 (July 25, 2026)
//    -> implement popular method
// 7. exercise 4.19: Blog List Expansion, step 7 (July 29, 2026)
//    -> add new blogs only if valid token is sent
// 8. exercise 4.21: Blog List Expansion, step 9 (Aug 5, 2026)
//    -> blog can be deleted only by user who added it
// 9. exercise 4.22: Blog List Expansion, step 10 (Aug 12, 2026)
//    -> add middleware 'userExtractor' to POST and DELETE


const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


// exercise 4.17: add popular method
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// exercise 4.22: add middleware userExtractor
blogsRouter.post('/', userExtractor, async (request, response, next) => {

  const body = request.body

  try {

    const user = request.user // user who is doing POST

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id // exercise 4.17: add 'user'
    })

    // exercise 4.17: save the blog
    const savedBlog = await blog.save()

    // exercise 4.17: retrieve new blog id and save back to user
    user.blogs.push(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  } catch(error) {
    next(error)
  }
})


// exercise 4.13: delete a single blog post
// exercise 4.21: can only be deleted by the creator
// exercise 4.22: add middleware userExtractor
blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {

  try {

    const id = request.params.id // blog id attempted to delete

    // check whether blog id (attempted to delete) in database
    const toBeDelBlog = await Blog.findById(id)

    if (!toBeDelBlog) { // blog id not in database
      return response.status(404).json({ error: 'blog not found' })
    }

    const user = request.user // user who is doing DELETE

    // check whether user is the blog creator
    if ( toBeDelBlog.user.toString() === user.id.toString() ) {

      await Blog.findByIdAndDelete(id)
      response.statusMessage = `Success: blog id = ${id} is deleted.`
      response.status(204).end()

    } else {
      // id not match blog id -> user is not creator
      response
        .status(401)
        .json({ error: `Error: unauthorized to delete blog id = ${id}.` })
    }
  } catch (error) {
    next(error)
  }
})


// exercise 4.14: update info of an individual blog post

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const id = request.params.id

    // check whether the request is empty
    if (Object.keys(request.body).length === 0) {
      return response
        .status(400)
        .json({ error: `Error: id = ${id} request is empty.` })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      request.body, // content to be updated
      { returnDocument: 'after', // return updated record
        runValidators: true, // turn on validation
        context: 'query' }
    )

    // to confirm update operation is done
    if (updatedBlog) {
      response.statusMessage = `Success: id = ${id} is modified`
      response
        .status(200)
        .json(updatedBlog)
    }
    else {
      // findByIdAndUpdate return null -> id format ok but record not found
      response
        .status(404)
        .json({ error: `Error: id = ${id} cannot be found.` })
    }
  } catch (error) {
    next(error)
  }

})


module.exports = blogsRouter

