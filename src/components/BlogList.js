import Blog from './Blog';

import { useSelector } from 'react-redux';

import NewBlog from './NewBlog';

const BlogList = () => {
  const blogs = useSelector((store) => store.blogs);
  const user = useSelector((store) => store.user);
  return (
    <>
      {user !== null && <NewBlog />}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;
