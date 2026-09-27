// Full Stack open, The University of Helsinki
// Exercises 5.1 - 5.4 Blog List Frontend
// Url : https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
// Created on 2026-08-30 22:50 HKT

// Change log :
// 1. exercise 5.2: Blog List Frontend, step 2 (Aug 30, 2026)
//    -> Make login 'permanent' by using local storage
// 2. exercise 5.3: Blog List Frontend, step 3 (Sept 4, 2026)
//    -> Allow logged-in user to add new blogs
// 3. exercise 5.9: Blog List Frontend, step 9 (Sept 6, 2026)
//    -> Add 'put' service to amend blog record
// 4. exercise 5.11: Blog List Frontend, step 11 (Sept 7, 2026)
//    -> Add 'delete; service to delete blog


import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// exercise 5.3: add 'create' service
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// exercise 5.9: add 'put' service
const update = async newObject => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return response.data
}

// exercise 5.11: add 'delete' service
const deleteBlog = async deleteID => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${deleteID}`, config)
  return response // response.status = 204 if delete successful
}


export default { getAll, setToken, create, update, deleteBlog }