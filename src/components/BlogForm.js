import { useState } from 'react';

import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title,
      author,
      url,
    };

    createBlog(blogObject);
    setTitle('');
    setUrl('');
    setAuthor('');
  };

  return (
    <div className='formDiv'>
      <form onSubmit={addBlog}>
        <p>
          <label htmlFor='title'>Title: </label>
          <input
            name={title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id='title-input'
          />
        </p>
        <p>
          <label htmlFor='author'>Author: </label>
          <input
            name={author}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            id='author-input'
          />
        </p>
        <p>
          <label htmlFor='url'>Url: </label>
          <input
            name={url}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            id='url-input'
          />
        </p>
        <button id='create-button' type='submit'>
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};
