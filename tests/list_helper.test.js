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

const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


const listWithEmptyBlog = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listWithMultiBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const anotherListWithMultiBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 9,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]


// exercise 4.3: test dummy function always returns 1
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

// exervise 4.4: test function returns total sum of likes
describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithEmptyBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultiBlogs)
    assert.strictEqual(result, 36)
  })
})

// exervise 4.5: test function returns blog with the most likes
describe('blog with most likes', () => {

  test('of empty list is empty obj', () => {
    const result = listHelper.favoriteBlog(listWithEmptyBlog)
    assert.deepStrictEqual(result, {})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(listWithMultiBlogs)
    assert.deepStrictEqual(result, listWithMultiBlogs[2])
  })
})

// exervise 4.6: test function returns the author
// who has largest amount of blogs
describe('author has most blogs', () => {

  test('return message has correct property', () => {
    const actualResult = listHelper.mostBlogs(listWithOneBlog)
    assert.strictEqual(Object.keys(actualResult).length, 2)
    assert.ok(Object.hasOwn(actualResult, 'author'))
    assert.ok(Object.hasOwn(actualResult, 'blogs'))
  })

  test('of empty list is empty obj', () => {
    const actualResult = listHelper.mostBlogs(listWithEmptyBlog)
    assert.deepStrictEqual(actualResult, {})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const actualResult = listHelper.mostBlogs(listWithOneBlog)
    const expectedResult = { author: 'Edsger W. Dijkstra', blogs: 1 }
    assert.deepStrictEqual(actualResult, expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    const actualResult = listHelper.mostBlogs(listWithMultiBlogs)
    const expectedResult = { author: 'Robert C. Martin', blogs: 3 }
    assert.deepStrictEqual(actualResult, expectedResult)
  })

})


// Exercise 4.7: test function that returns
// author whoes blog has most likes and total sum of likes
describe('author has most likes', () => {

  test('return message has correct property', () => {
    const actualResult = listHelper.mostLikes(listWithOneBlog)
    assert.strictEqual(Object.keys(actualResult).length, 2)
    assert.ok(Object.hasOwn(actualResult, 'author'))
    assert.ok(Object.hasOwn(actualResult, 'likes'))
  })

  test('of empty list is empty obj', () => {
    const actualResult = listHelper.mostLikes(listWithEmptyBlog)
    assert.deepStrictEqual(actualResult, {})
  })

  test('when list has only one blog, equals the likes of that', () => {
    const actualResult = listHelper.mostLikes(listWithOneBlog)
    const expectedResult = { author: 'Edsger W. Dijkstra', likes: 5 }
    assert.deepStrictEqual(actualResult, expectedResult)
  })

  test('of a bigger list is calculated right', () => {
    const actualResult = listHelper.mostLikes(anotherListWithMultiBlogs)
    const expectedResult = { author: 'Robert C. Martin', likes: 21 }
    assert.deepStrictEqual(actualResult, expectedResult)
  })

})
