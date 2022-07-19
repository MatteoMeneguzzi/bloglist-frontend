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
    blogService.getAll().then((blogs) => {
      const newBlogs = blogs.sort((a, b) => b.likes - a.likes);

      setBlogs(newBlogs);
    });
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
      setErrorMessage('wrong credentials');
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
    blogFormRef.current.setVisible();
    blogService
      .create(blog)
      .then((returnedBlog) => {
        console.log(returnedBlog);
        setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes));
        setSuccessMessage('a new blog was added');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((err) => {
        setErrorMessage(`${err.response.data.error}`);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const updateBlog = (blog) => {
    blogService
      .updateLikes(blog.id, blog)
      .then(() => {
        const newBlogs = blogs.map((item) =>
          item.id !== blog.id ? item : blog
        );
        console.log(newBlogs);

        const sortedBlogs = newBlogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const deleteBlog = (blog) => {
    console.log(blog);
    if (window.confirm(`Do you really want to delete blog ${blog.title}`))
      blogService.deleteBlog(blog.id);
    const newBlogs = blogs.filter((item) => item.id !== blog.id);
    setBlogs(newBlogs);
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
    <div>
      {user === null ? (
        <>
          <h2>login to application</h2>
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
              className='error'
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
              className='success'
            >
              {successMessage}
            </p>
          ) : null}
          {loginForm()}
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
              className='error'
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
              className='success'
            >
              {successMessage}
            </p>
          ) : null}
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogOut}>Log out</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <h2>create new blog</h2>
            <BlogForm createBlog={createBlog} blogs={blogs} />
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
