/* eslint-disable indent */
import { useState, useEffect } from 'react';

import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';

import { initializeBlogs } from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';
import { showNotificationWithTimeout } from './reducers/notificationReducer';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './components/BlogList';
import Users from './routes/Users';
import User from './routes/User';
import BlogPost from './routes/BlogPost';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector((store) => store.user);

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

  return (
    <Router>
      <div>
        <Link style={{ padding: 5 }} to='/'>
          blogs
        </Link>
        <Link style={{ padding: 5 }} to='/users'>
          users
        </Link>
      </div>
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
        </div>
      )}
      <h2>Blog App</h2>

      <Routes>
        <Route path='/blogs/:id' element={<BlogPost />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/' element={<BlogList />} />
        <Route path='/users' element={<Users />} />
      </Routes>
    </Router>
  );
};

export default App;
