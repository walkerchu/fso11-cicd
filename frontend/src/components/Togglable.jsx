// Full Stack open, The University of Helsinki
// Exercises 5.1 - 5.4 Blog List Frontend
// Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// Created on 2026-09-05 09:23 HKT

// Change log :
// 1. exercise 5.5: Blog List Frontend, step 5 (Sept 5, 2026)
//    -> Only display the form when appropriate


import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // exercise 5.5: expose toggleVisibility to parent component via ref
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button
          className="toggle-button"
          onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button
          className="btn-secondary"
          onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable