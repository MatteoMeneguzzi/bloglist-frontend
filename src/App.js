import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
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
      setUser(user);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUsername('');
      setPassword('');
      setSuccessMessage(`${user.name} successfully logged in`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(`wrong username or password`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleLogOut = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem('loggedBlogappUser');
      blogService.setToken('');
      setUser(null);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception.message);
    }
  };

  const createBlog = (blog) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blog)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setSuccessMessage(`a new blog has been added`);
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((err) => {
        setErrorMessage(`${err.response.data.error}`);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  return (
    <div>
      {user === null ? (
        <>
          <h2>log in to application</h2>
          {errorMessage.length > 2 && (
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
            >
              {errorMessage}
            </p>
          )}
          {successMessage.length > 2 && (
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
            >
              {successMessage}
            </p>
          )}

          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            setPassword={({ target }) => setPassword(target.value)}
            setUsername={({ target }) => setUsername(target.value)}
          />
        </>
      ) : (
        <div>
          {errorMessage.length > 2 && (
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
            >
              {errorMessage}
            </p>
          )}
          {successMessage.length > 2 && (
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
            >
              {successMessage}
            </p>
          )}
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogOut}>Log out</button>
          </p>

          <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
        </div>
      )}

      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
