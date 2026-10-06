// Full Stack open, The University of Helsinki
// Exercises 5.1 - 5.4 Blog List Frontend
// Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// Created on 2026-09-05 09:45 HKT

// Change log :
// 1. exercise 5.5: Blog List Frontend, step 5 (Sept 5, 2026)
//    -> Extract 'Create New' form from App.jsx
// 2. exercise 5.29: styled blogs, step 1 (Sept 19, 2026)
//    -> Add styles to the application’s forms



import { useState } from 'react'

import { Button, TextField } from '@mui/material'


const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()

    await createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <form id='createNew' onSubmit={handleCreate}>
      <div>
        <TextField
          label='title'
          type='text'
          value={title}
          // required
          onChange={({ target }) => setTitle(target.value)}
          style={{ marginBottom: 10, minWidth:400 }}
          variant='outlined'
          slotProps={{ htmlInput: {
            'data-testid': 'titleInput',
            // pattern:'.*\\S.*',
            // title:'Please enter a valid title (cannot be empty or spaces only)'
          } }}
          size="small" />
      </div>
      <div>
        <TextField
          label='author'
          type='text'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          style={{ marginBottom: 10, minWidth:400 }}
          variant='outlined'
          slotProps={{ htmlInput: {
            'data-testid': 'authorInput', } }}
          size="small" />

      </div>
      <div>
        <TextField
          label='url'
          type='text'
          value={url}
          // required
          onChange={({ target }) => setURL(target.value)}
          style={{ marginBottom: 10, minWidth:400 }}
          variant='outlined'
          size="small"
          slotProps={{
            htmlInput: {
              'data-testid': 'urlInput',
              // pattern: '.*\\S.*',
              // title: 'Please enter a valid title (cannot be empty or spaces only)',
            },
          }}
        />

      </div>
      <Button
        type='submit'
        variant="contained"
        id='createButton'
        data-testid='createButton'
        style={{ marginTop: 10 }}>create
      </Button>
    </form>
  )
}

export default BlogForm
