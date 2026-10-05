// Full Stack open, The University of Helsinki
// Exercises 5.24–5.28 Routed Blogs
// Url : https://fullstackopen.com/en/part5/react_router_ui_frameworks#exercises-5-24-5-28
// Modified on 2026-09-16 20:48 HKT

// Change log :
// 1. exercise 5.25: routed blogs, step 2 (Sept 16, 2026)
//    -> Implement a view to display a single blog post
// 2. exercise 5.31: styled blogs, step 3 (Sept 20, 2026)
//    -> Customize style of single blog display component

import { useParams } from 'react-router-dom'
import { Button, Stack, Link, Paper, Typography } from '@mui/material'

const BlogDetails = ({ blogs, updateLikes, loggedUsername, onDelete }) => {

  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) return (
    <Typography
      className='alert'
      variant='body1'
      sx={{ color:'grey.800', m:4 }}
    >Loading blog details...</Typography>
  )

  return (

    <Paper
      elevation={3}
      sx={{ mt:2, p:3, bgcolor:'grey.100' }}>

      <Typography
        data-testid='blogTitle'
        variant="h4"
        component="h2"
      >{blog.title}</Typography>

      <Typography
        data-testid='blogAuthor'
        variant="subtitle1"
        sx={{ color:'grey.800', fontSize:'1.2rem' }}
      >by {blog.author}</Typography>

      <Link
        className="blog_details"
        data-testid='blogUrl'
        href={blog.url}
        sx={{ mt: 1, mb: 2 }}
      >{blog.url}</Link>

      <Typography
        variant='body1'
        className="blog_details"
        sx={{ color:'grey.800', mt: 1, mb: 2 }}
      >Added by {blog.user?.name}</Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems:'center' }}
      >

        <Typography
          variant='body1'
          className="blog_details"
          sx={{ color:'grey.800', mt: 1, mb: 2 }}
        >
          {/* exercise 11.21: change 'id' to 'data-testid' */}
          <span data-testid='numLikes'>{blog.likes}</span> likes
        </Typography>

        {/* show like button only user already logged in */}
        {loggedUsername && <Button
          id='likeButton'
          data-testid='likeButton'
          variant="outlined"
          color='success'
          onClick={() => updateLikes(blog)}>like
        </Button>}

        {loggedUsername === blog.user?.username && (
          <Button
            id='removeButton'
            data-testid='removeButton'
            variant="outlined"
            color='error'
            onClick={() => onDelete(blog)}>remove
          </Button>
        )}
      </Stack>
    </Paper>

  )
}

export default BlogDetails