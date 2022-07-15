import Togglable from './Togglable';
import { useRef } from 'react';

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const blogDetailRef = useRef();

  const toggleVisibility = () => {
    blogDetailRef.current.setVisible();
  };

  const addLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };

    updateBlog(newBlog);
  };

  return (
    <Togglable
      buttonLabel={'view'}
      ref={blogDetailRef}
      title={blog.title}
      author={blog.author}
    >
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>hide</button>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes} <button onClick={addLike}>like</button>
      </div>
      <div>{blog.user?.name}</div>
      {user.username === blog.user?.username && (
        <button onClick={() => deleteBlog(blog)}>remove</button>
      )}
    </Togglable>
  );
};

export default Blog;
