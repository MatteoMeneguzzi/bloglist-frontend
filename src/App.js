/* eslint-disable indent */
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';

import {
  initializeBlogs,
  createBlog,
  updateVote,
  removeBlog,
} from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';
import { showNotificationWithTimeout } from './reducers/notificationReducer';

const App = () => {
  const blogs = useSelector((store) => store.blogs);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [user, setUser] = useState(null);
  const user = useSelector((store) => store.user);

  const blogFormRef = useRef();

  const dispatch = useDispatch();

  const notification = useSelector((store) => store.notification);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
      dispatch(
        showNotificationWithTimeout({
          content: `${user.name} successfully logged in`,
          timer: 3000,
        })
      );
    } catch (error) {
      dispatch(
        showNotificationWithTimeout({
          content: 'wrong credentials',
          timer: 3000,
        })
      );
    }
  };

  const handleLogOut = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem('loggedBlogappUser');
      blogService.setToken('');
      dispatch(setUser(null));
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception.message);
    }
  };

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

  const updateBlog = (blog) => {
    dispatch(updateVote(blog))
      .then()
      .catch((err) => {
        console.log(err.message);
      });
  };

  const deleteBlog = (blog) => {
    console.log(blog);
    if (window.confirm(`Do you really want to delete blog ${blog.title}`))
      dispatch(removeBlog(blog.id));
  };
  const loginForm = () => {
    return (
      <Togglable buttonLabel={'log in'}>
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          setPassword={({ target }) => setPassword(target.value)}
          setUsername={({ target }) => setUsername(target.value)}
        />
      </Togglable>
    );
  };

  console.log(user);
  return (
    <div>
      {user === null ? (
        <>
          <h2>login to application</h2>
          {notification.content.includes('wrong') &&
            notification.content.length > 15 && (
              <p
                style={{
                  color: 'red',
                  background: 'lightgrey',
                  fontSize: 20,
                  border: 'solid',
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                }}
                className='error'
              >
                {notification.content}
              </p>
            )}
          {loginForm()}
        </>
      ) : (
        <div>
          {notification.content.includes('validation') ? (
            <p
              style={{
                color: 'red',
                background: 'lightgrey',
                fontSize: 20,
                border: 'solid',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              className='error'
            >
              {notification.content}
            </p>
          ) : null}
          {notification.content.includes('added') ||
          notification.content.includes('logged') ? (
            <p
              style={{
                color: 'green',
                background: 'lightgrey',
                fontSize: 20,
                border: 'solid',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              className='success'
            >
              {notification.content}
            </p>
          ) : null}
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogOut}>Log out</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <h2>create new blog</h2>
            <BlogForm createBlog={addBlog} blogs={blogs} />
          </Togglable>
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;
