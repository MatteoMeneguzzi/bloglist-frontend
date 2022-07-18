import { useState } from 'react'

import PropTypes from 'prop-types'

const BlogForm = ({ blogs, createBlog }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
      id: blogs.length + 1,
    }

    createBlog(blogObject)
    setTitle('')
    setUrl('')
    setAuthor('')
  }

  return (
    <form onSubmit={addBlog}>
      <p>
        <label htmlFor='title'>Title: </label>
        <input
          name={title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </p>
      <p>
        <label htmlFor='author'>Author: </label>
        <input
          name={author}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </p>
      <p>
        <label htmlFor='url'>Url: </label>
        <input
          name={url}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </p>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm

BlogForm.propTypes = {
  blogs: PropTypes.array.isRequired,
  createBlog: PropTypes.func.isRequired,
}
