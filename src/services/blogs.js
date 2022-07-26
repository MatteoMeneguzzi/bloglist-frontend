import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const updateLikes = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
  console.log(response);
  return response.data;
};

const commentBlog = async (data) => {
  const config = {
    headers: { Authorization: token },
  };

  console.log(data.comment);
  const response = await axios.post(
    `${baseUrl}/${data.id}/comments`,
    data,
    config
  );
  console.log(response);
  return response.data;
};

export default {
  getAll,
  setToken,
  create,
  updateLikes,
  deleteBlog,
  commentBlog,
};
