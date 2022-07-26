import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initializeUsers } from '../reducers/usersReducer';

import { useParams, Link } from 'react-router-dom';

const User = () => {
  const id = useParams().id;
  console.log(id);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  const users = useSelector((store) => store.users);

  const user = users.find((n) => n.id === id);

  return (
    <>
      <h2>{user?.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user?.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default User;
