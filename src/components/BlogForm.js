import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

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
  );
};

export default BlogForm;
