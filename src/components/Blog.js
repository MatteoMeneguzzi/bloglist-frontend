import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  // const dispatch = useDispatch();

  // const deleteBlog = (blog) => {
  //   if (window.confirm(`Do you really want to delete blog ${blog.title}`))
  //     dispatch(removeBlog(blog.id));
  // };

  return (
    <div
      className='blog'
      style={{ padding: 5, border: '1px solid', marginBlock: 5 }}
    >
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} by {blog.author}{' '}
      </Link>
    </div>
  );
};

export default Blog;
