// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Blog List
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-14 02:56 HKT

// Change log :
// 1. Exercise 4.3: Helper Functions and Unit Tests, step 1 (July 14, 2026)
//    -> define a dummy function and test it
// 2. Exercise 4.4: Helper Functions and Unit Tests, step 2 (July 14, 2026)
//    -> define a new totalLikes function
// 3. Exercise 4.5: Helper Functions and Unit Tests, step 3 (July 18, 2026)
//    -> define new function returns the blog with the most likes.
// 4. Exercise 4.6: Helper Functions and Unit Tests, step 4 (July 18, 2026)
//    -> define function returns author who has largest amount of blogs
// 5. Exercise 4.7: Helper Functions and Unit Tests, step 5 (July 18, 2026)
//    -> returns author whoes have the largest amount of likes


// exercise 4.3: dummy function always returns 1
const dummy = (blogs) => {
  return 1
}

// exervise 4.4: receives a list of blog posts as a parameter.
// returns the total sum of likes in all blog posts.
const totalLikes  = (blogs) => {
  let ttlLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return ttlLikes
}

// exercise 4.5: returns the blog with the most likes.
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}  // return empty object if empty list
  }
  let result = blogs.reduce((max, item) => {
    if (item.likes > max.likes) {
      return item
    } else {return max}
  }, blogs[0] // blogs[0] as initial value
  )
  return result
}

// exercise 4.6: returns author who has largest amount of blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}  // return empty object if empty list
  }

  // construct frequency table of 'author'
  const freqTable = blogs.reduce((acc, item) => {
    acc[item.author] = (acc[item.author] || 0) + 1
    return acc
  }, {})

  // sort table from highest to lowest
  const sortedTable = Object.entries(freqTable).sort((a, b) => b[1] - a[1])

  return { author: sortedTable[0][0], blogs: sortedTable[0][1] }
}

// exercise 4.7: returns author whoes have the largest amount of likes

const mostLikes = (blogs) => {

  if (blogs.length === 0) {
    return {}  // return empty object if empty list
  }

  // initialize
  const authorMap = new Map()
  let topAuthor = null
  let maxLikes = -Infinity  // assume number of likes could be negative

  for (const blog of blogs) {

    const currentLikes = (authorMap.get(blog.author) || 0) + blog.likes
    authorMap.set(blog.author, currentLikes)

    if (currentLikes > maxLikes) { // check whether blog.author is new winner
      maxLikes = currentLikes
      topAuthor = blog.author
    }
  }
  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}