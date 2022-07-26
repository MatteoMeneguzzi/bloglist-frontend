import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    voteBlog(state, action) {
      const id = action.payload;
      console.log(id);

      const blogToVote = state.find((n) => n.id === id);

      const changedBlog = {
        ...blogToVote,
        likes: blogToVote.likes + 1,
      };

      const newState = state.map((blog) =>
        blog.id !== id ? blog : changedBlog
      );

      return newState.sort((a, b) => b.likes - a.likes);
    },
    appendBlog(state, action) {
      state.push(action.payload);
      return state.sort((a, b) => b.likes - a.likes);
    },
    setBlogs(state, action) {
      const newState = action.payload.sort((a, b) => b.likes - a.likes);
      return newState;
    },
  },
});

export const { voteBlog, appendBlog, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();

    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const updateVote = (blog) => {
  return async (dispatch) => {
    await blogService.updateLikes(blog.id, blog);

    dispatch(voteBlog(blog.id));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);

    const blogs = await blogService.getAll();

    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;
