/* eslint-disable indent */
import { useState, forwardRef, useImperativeHandle } from 'react'

import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = props.title
    ? {
        display: visible ? 'none' : '',
        border: 'solid 1px',
        borderColor: 'black',
        marginBottom: 10,
        padding: 5,
      }
    : {
        display: visible ? 'none' : '',
      }
  const showWhenVisible = props.title
    ? {
        display: visible ? '' : 'none',
        border: 'solid 1px',
        borderColor: 'black',
        marginBottom: 10,
        padding: 5,
      }
    : {
        display: visible ? '' : 'none',
      }

  useImperativeHandle(refs, () => {
    return {
      setVisible,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        {props.title} {props.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        {props.title ? null : (
          <button onClick={() => setVisible(!visible)}>cancel</button>
        )}
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}
