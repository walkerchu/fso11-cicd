// Full Stack open, The University of Helsinki
// Exercises 5.1 - 5.4 Blog List Frontend
// Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// Created on 2026-08-29 16:18 HKT

// Change log :
// 1. exercise 5.7: Blog List Frontend, step 7 (Sept 5, 2026)
//    -> Add button to control the display if blog details
// 2. exercise 5.11: Blog List Frontend, step 11 (Sept 7, 2026)
//    -> Add a new button for deleting blog posts
// 3. exercise 5.25: routed blogs, step 2 (Sept 16, 2026)
//    -> Implement a view to display a single blog post

// Exercise 5.3: change UI to table format
// Exercise 5.7: fall back to <div> format
// Exercise 5.25: extract blog details block to BlogDetails.jsx

import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  return (
    <>
      <Link
        to={`/blogs/${blog.id}`}
        className="blog_row"
        data-testid="blogRowLink">
        <ul>
          <li>{blog.title} by {blog.author}</li>
        </ul>
      </Link>
    </>
  )
}

export default Blog