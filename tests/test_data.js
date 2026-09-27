// Full Stack open, The University of Helsinki
// Exercises 4.8 - 4.12 Blog List Tests
// Url : https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12
// Created on 2026-07-19 12:18 HKT

// Blog Test Data

const initBlog =[ {
  'title': 'React patterns',
  'author': 'Michael Chan',
  'url': 'https://reactpatterns.com/',
  'likes': 7,
}]
const normalNewBlog ={
  'title': 'Canonical string reduction 5',
  'author': 'Edsger W. Dijkstra',
  'url': 'http://www.cs.utexas.edu/normal.html',
  'likes': 5,
}
const newBlogMissTitle ={
  'author': 'Edsger W. Dijkstra',
  'url': 'http://www.cs.utexas.edu/dummy/dummy.html',
  'likes': 4,
}
const newBlogMissURL ={
  'title': 'Canonical string reduction 4',
  'author': 'Edsger W. Dijkstra',
  'likes': 3,
}
const newBlogMissTitleURL ={
  'url': 'http://www.cs.utexas.edu/dummy/dummy.html',
  'likes': 2,
}

// User Test Data

const initialUsers = [
  {
    username: 'root',
    name: 'System Admin',
    password: 'supersecretpassword'
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'fullstackopen'
  },
  {
    username: 'johndoe',
    name: 'John Doe',
    password: 'password123'
  }
]

const invalidUsers = {
  // Missing a required field
  missingUsername: {
    name: 'No Username User',
    password: 'validpassword123'
  },
  // Missing a required Password
  missingPassword: {
    username: 'No Password User',
    name: 'No Password',
  },
  // Password is too short (less than 3 characters)
  shortPassword: {
    username: 'shorty',
    name: 'Short Password',
    password: '12'
  },
  // Username is too short (less than 3 characters)
  shortUsername: {
    username: 'jo',
    name: 'Joe Shmoe',
    password: 'validpassword123'
  }
}


module.exports = {
  initBlog,
  normalNewBlog,
  newBlogMissTitle,
  newBlogMissURL,
  newBlogMissTitleURL,
  initialUsers,
  invalidUsers
}