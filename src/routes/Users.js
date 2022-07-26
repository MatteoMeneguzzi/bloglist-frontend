import { useEffect } from 'react';
import { initializeUsers } from '../reducers/usersReducer';

import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

const Users = () => {
  const dispatch = useDispatch();

  const users = useSelector((store) => store.users);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>{''}</th>
            <th>
              <strong>blogs created</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {users.map((user) => {
        <div>ciao{user.name}</div>;
      })}
    </>
  );
};

export default Users;
