// Full Stack open, The University of Helsinki
// Exercises 5.1 - 5.4 Blog List Frontend
// Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// Created on 2026-08-29 18:34 HKT

// Change log :
// 1. exercise 5.1: Blog List Frontend, step 1 (Aug 29, 2026)
//    -> Implement login functionality to frontend

import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }

