// Full Stack open, The University of Helsinki
// Exercises 5.1 - 5.4 Blog List Frontend
// Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// Created on 2026-08-29 23:15 HKT

// Change log :
// 1. exercise 5.1: Blog List Frontend, step 1 (Aug 29, 2026)
//    -> Implement login functionality to frontend
// 2. exercise 5.4: Blog List Frontend, step 4 (Sept 4, 2026)
//    -> modify Notifications function to accept two parameters
// 3. exercise 5.30: styled blogs, step 2 (Sept 20, 2026)
//    -> Add styles to navigation bar and notifications

import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  // set 'error' as default value
  const messageType = notification.notifyType || 'error'

  // exercise 5.30 change <div> to <Alert>
  return <Alert
    className = {messageType}
    severity = {messageType}
    style={{ marginTop: 10, marginBottom: 10 }}
  >
    {notification.message}</Alert>
}

export default Notification