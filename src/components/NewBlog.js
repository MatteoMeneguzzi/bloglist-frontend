import BlogForm from './BlogForm';
import Togglable from './Togglable';

import { useRef } from 'react';

import { createBlog } from '../reducers/blogReducer';
import { showNotificationWithTimeout } from '../reducers/notificationReducer';

import { useDispatch } from 'react-redux';

const Users = () => {
  const blogFormRef = useRef();
  const dispatch = useDispatch();

  const addBlog = (blog) => {
    blogFormRef.current.setVisible();
    dispatch(createBlog(blog))
      .then(() => {
        dispatch(
          showNotificationWithTimeout({
            content: `a new blog ${blog.title} by ${blog.author} was added`,
            timer: 3000,
          })
        );
      })
      .catch((err) => {
        dispatch(
          showNotificationWithTimeout({
            content: `${err.response.data.error}`,
            timer: 3000,
          })
        );
      });
  };

  return (
    <div>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <h2>create new blog</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    </div>
  );
};

export default Users;
