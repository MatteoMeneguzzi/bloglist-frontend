import { useSelector } from 'react-redux';
// import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { initializeUsers } from '../reducers/usersReducer';
import { updateVote } from '../reducers/blogReducer';

import { useParams } from 'react-router-dom';

import { useState, useEffect } from 'react';

import axios from 'axios';

import blogsService from '../services/blogs';

const User = () => {
  const [comment, setComment] = useState('');

  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);

  const id = useParams().id;

  const dispatch = useDispatch();

  const blogs = useSelector((store) => store.blogs);

  const blog = blogs.find((n) => n.id === id);

  const updateBlog = (blog) => {
    dispatch(updateVote(blog))
      .then()
      .catch((err) => {
        console.log(err.message);
      });
  };

  const addLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };

    updateBlog(newBlog);
  };

  const baseUrl = `/api/blogs/${blog?.id}}/comments`;

  const getAllComments = async () => {
    const request = axios.get(baseUrl);
    const response = await request;
    setComments(response.data);
    getSpecificComments();
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    try {
      const current = await blogsService.commentBlog({
        id,
        content: comment,
      });

      setComment('');

      setComments(comments.concat(current));
    } catch (error) {
      console.log(error);
    }
  };

  const getSpecificComments = () => {
    let currentComments = comments.filter(
      (comment) => blog?.id === comment.blog
    );
    setVisibleComments(currentComments);
    console.log(visibleComments);
  };

  console.log(comments);
  console.log(blog);

  useEffect(() => {
    getAllComments();
  }, [blog]);

  return (
    <>
      <h2>{blog?.title}</h2>
      <div>{blog?.url}</div>
      <div id='blog-likes'>
        {blog?.likes} likes{' '}
        <button id='like-button' className='like-button' onClick={addLike}>
          like
        </button>
      </div>
      <div>added by {blog?.author}</div>

      <form onSubmit={handleAddComment}>
        <input
          type='text'
          value={comment}
          name='Comment'
          onChange={(e) => setComment(e.target.value)}
          id='comment'
        />

        <button id='login-button' type='submit'>
          add comment
        </button>
      </form>

      <h2>comments</h2>
      <ul>
        {visibleComments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </>
  );
};

export default User;
