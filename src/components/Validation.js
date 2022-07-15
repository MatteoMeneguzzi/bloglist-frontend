import { useState, forwardRef, useImperativeHandle } from 'react';

const Blog = ({ blog }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
  return (
    <div>
      {errorMessage.length > 2 && (
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
      )}
      {successMessage.length > 2 && (
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
      )}
    </div>
  );
};

export default Blog;
