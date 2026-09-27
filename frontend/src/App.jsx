// Full Stack open, The University of Helsinki
// a. Exercises 5.1 - 5.4 Blog List Frontend
//    Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// b. Exercises 5.24–5.28 Routed Blogs
//    Url : https://fullstackopen.com/en/part5/react_router_ui_frameworks#exercises-5-24-5-28
// c. Exercises 5.29–5.31 Routed Blogs
//    Url : https://fullstackopen.com/en/part5/react_router_ui_frameworks#exercises-5-29-5-31
// Created on 2026-08-29 16:18 HKT

// Change log :
// 1. exercise 5.1: Blog List Frontend, step 1 (Aug 29, 2026)
//    -> Implement login functionality to frontend
// 2. exercise 5.2: Blog List Frontend, step 2 (Aug 30, 2026)
//    -> Make login 'permanent' by using local storage
// 3. exercise 5.3: Blog List Frontend, step 3 (Aug 31, 2026)
//    -> Allow logged-in user to add new blogs
// 4. exercise 5.4: Blog List Frontend, step 4 (Sept 4, 2026)
//    -> Add notifications for successful/unsuccessful operations
// 5. exercise 5.5: Blog List Frontend, step 5 (Sept 5, 2026)
//    -> Only display 'Create New' form when appropriate
// 6. exercise 5.7: Blog List Frontend, step 7 (Sept 5, 2026)
//    -> Add button to control the display if blog details
// 7. exercise 5.8: Blog List Frontend, step 8 (Sept 6, 2026)
//    -> Implement the functionality for the like button
// 8. exercise 5.9: Blog List Frontend, step 9 (Sept 6, 2026)
//    -> Fix user name that added the blog is not shown
// 9. exercise 5.10: Blog List Frontend, step 10 (Sept 6, 2026)
//    -> Sort blog posts by number of likes
// 10. exercise 5.11: Blog List Frontend, step 11 (Sept 7, 2026)
//    -> Add a new button for deleting blog posts
// 11. exercise 5.24: routed blogs, step 1 (Sept 14, 2026)
//    -> Add React Router and navigation bar
// 12. exercise 5.25: routed blogs, step 2 (Sept 16, 2026)
//    -> Implement a view to display a single blog post
// 13. exercise 5.26: routed blogs, step 3 (Sept 17, 2026)
//    -> Create a new view for creating a new blog
// 14. exercise 5.29: styled blogs, step 1 (Sept 19, 2026)
//    -> Add styles to the application’s forms
// 15. exercise 5.30: styled blogs, step 2 (Sept 20, 2026)
//    -> Add styles to navigation bar and notifications
// 16. exercise 5.31: styled blogs, step 3 (Sept 20, 2026)
//    -> Customize style of single blog display component

import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, useNavigate,
} from 'react-router-dom'  // exercise 5.24 added

import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import BlogDetails from './components/BlogDetails'

import CssBaseline from '@mui/material/CssBaseline'

import {
  Container, Toolbar, Button, TextField, Typography,
  AppBar, Box,
} from '@mui/material'
import * as styles from './materialStyles'


// import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState(null)

  const navigate = useNavigate() // exercise 5.24 added

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // Exercise 5.2: restore user session on page reload
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      // Fetch fresh blog list from server after logging in
      const freshBlogs = await blogService.getAll()
      setBlogs(freshBlogs)
      navigate('/')

    } catch {
      setNotifyMessage({ message: 'wrong username or password', notifyType: 'error' })
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
  }

  // Exercise 5.3: add 'create' functionality
  // Exercise 5.5: hide 'create' form upon successful submission
  const handleCreate = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      // blogFormRef.current.toggleVisibility()


      // Exercise 5.9: attach current logged-in user details to returnedBlog
      const blogWithUser = {
        ...returnedBlog,
        user: {
          id: returnedBlog.user,
          username: user.username,
          name: user.name
        }
      }
      setBlogs(blogs.concat(blogWithUser))

      setNotifyMessage(
        {
          message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
          notifyType: 'success'
        })
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
      navigate('/')  // exercise 5.26: redirect to all blogs view

    } catch {
      setNotifyMessage({ message: 'create new blog failure', notifyType: 'error' })
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
  }

  // Exercise 5.8: add functionality for like button
  const handleLike = async (blogObject) => {

    // Exercise 5.25: prevent API being call if user not yet logged in
    if (!user) {return null}

    try {
      const updatedBlog = await blogService.update({
        ...blogObject,
        likes: blogObject.likes + 1,
        user: blogObject.user?.id || blogObject.user
      })
      setBlogs(blogs
        .map(blog => blog.id === blogObject.id ? { ...updatedBlog, user: blogObject.user } : blog)
      )
    } catch {
      setNotifyMessage({ message: 'failed to update likes', notifyType: 'error' })
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
  }

  // Exercise 5.11: add 'delete' blog functionality
  const handleDelete = async (blogObject) => {
    if (
      window.confirm(
        `Remove blog: ${blogObject.title} by ${blogObject.author} ?`,
      )
    ) {
      try {
        await blogService.deleteBlog(blogObject.id)
        const remainingBlogs = blogs.filter(
          blog => blog.id !== blogObject.id,
        )
        setBlogs(remainingBlogs)
        navigate('/')  // exercise 5.26: redirect to all blogs view

      } catch {
        setNotifyMessage({ message: 'delete failure', notifyType: 'error' })
        setTimeout(() => {
          setNotifyMessage(null)
        }, 5000)
      }
    } else {
      return null // end-user won't confirm. do nothing.
    }
  }

  // Exercise 5.2: add 'logout' functionality
  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      blogService.setToken(null)
      navigate('/login')
    } catch {
      setNotifyMessage({ message: 'logout failure', notifyType: 'error' })
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
  }


  return (
    <Container>
      <CssBaseline />
      {/* exercise 5.24: add navigation structure */}
      {/* exercise 5.26: add 'new blog' */}
      <AppBar position="static"><Toolbar>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Typography variant='h4'>Blog App</Typography>

          <Box sx={{ marginLeft: 'auto' }} data-testid='nav-bar' >

            <Button
              color="inherit"
              sx={styles.navButtonStyle}
              component={Link}
              to="/"
              id='blogsLink'>blogs
            </Button>

            {user ? (
              <>
                <Button
                  color="inherit"
                  sx={styles.navButtonStyle}
                  component={Link}
                  to="/create"
                  id='createLink'>new blog
                </Button>

                <Button
                  color="inherit"
                  sx={styles.navButtonStyle}
                  type="button"
                  id="logoutButton"
                  onClick={handleLogout}>logout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                sx={styles.navButtonStyle}
                component={Link}
                to="/login">
                <span id='loginLink'>login</span>
              </Button>
            )}

          </Box>
        </Box>
      </Toolbar>
      </AppBar>

      <Notification notification={notifyMessage} />


      <Routes>
        <Route path="/" element={
          <div>
            <h3>blogs</h3>

            {/* exercise 5.8: add 'updateLikes' to pass handler prop
                exercise 5.10: sort the blogs by number of likes
                exercise 5.11: add 'loggedUsername'/'onDelete' to remove blog */}
            {blogs
              .toSorted((a, b) => b.likes - a.likes)
              .map(blog => <Blog key={blog.id} blog={blog}/>)}
          </div>
        } />

        <Route path="/login" element={
          <div>
            <h2>log in to application</h2>
            {/* exercise 5.4: relocate banner position */}
            <form onSubmit={handleLogin}>
              <div>
                <TextField
                  label='username'
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                  style={{ marginBottom: 10, minWidth:300 }}
                  variant='standard'
                  slotProps={{ htmlInput: { maxLength: 20 } }}
                />
              </div>
              <div>
                <TextField
                  label='password'
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  style={{ marginBottom: 10, minWidth:300 }}
                  variant='standard'
                  slotProps={{ htmlInput: { maxLength: 20 } }}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                id="loginButton"
                style={{ marginTop: 10 }}>login</Button>
            </form>

          </div>
        } />

        {/* Exercise 5.25: add route for single blog view */}
        <Route path="/blogs/:id" element={
          <BlogDetails
            blogs={blogs}
            updateLikes={handleLike}
            loggedUsername={user?.username}
            onDelete={handleDelete} />
        } />

        {/* Exercise 5.26: add route for create new blog view */}
        <Route path="/create" element={
          user ? (
            <>
              <h3>create new</h3>
              <BlogForm createBlog={handleCreate} />
            </>
          ) : (
            <div className='alert'>Please login before creating new blog.</div>
          )

        } />

      </Routes>
    </Container>
  )
}

export default App