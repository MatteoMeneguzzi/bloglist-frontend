import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState([]);
  const [author, setAuthor] = useState([]);
  const [url, setUrl] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(null);

  const hideWhenVisible = { display: loginVisible ? 'none' : '' };
  const showWhenVisible = { display: loginVisible ? '' : 'none' };

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
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
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

  const addBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title,
      author,
      url,
      id: blogs.length + 1,
    };

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setTitle('');
        setAuthor('');
        setUrl('');
        setSuccessMessage(`a new blog ${title} by ${author} added`);
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
          {errorMessage.length > 2 ? (
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
          ) : null}
          {successMessage.length > 2 ? (
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
          ) : null}
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            setPassword={setPassword}
            setUsername={setUsername}
          />
        </>
      ) : (
        <div>
          {errorMessage.length > 2 ? (
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
          ) : null}
          {successMessage.length > 2 ? (
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
          ) : null}
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogOut}>Log out</button>
          </p>

          <p style={hideWhenVisible}>
            <button onClick={() => setLoginVisible(true)}>
              create new blog
            </button>
          </p>

          <div style={showWhenVisible}>
            <h2>create new blog</h2>
            <BlogForm
              title={title}
              author={author}
              url={url}
              setTitle={setTitle}
              setAuthor={setAuthor}
              setUrl={setUrl}
              addBlog={addBlog}
            />
            <p>
              <button onClick={() => setLoginVisible(false)}>CANCEL</button>
            </p>
          </div>
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
