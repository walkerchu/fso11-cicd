// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Phonebook backend
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-15 22:30 HKT

// Change log :
// 1. exercise 4.1: Blog List, step 1 (July 16, 2026)
//    -> turn into a functioning npm project.
// 2. exercise 4.2: Blog List, step 2 (July 16, 2026)
//    -> refactor into separate modules.
// 3. exercise 4.8: Blog List Tests, step 1 (July 18, 2026)
//    -> set up test environment by using cross-env package


require('dotenv').config({ path: '.env.local' })

const logger = require('./logger')
const PORT = process.env.PORT || 3003

// exercise 4.1 : build the MongoDB connection url
const db_user = process.env.MONGODB_USER
const db_password = process.env.MONGODB_PASSWORD
const db_cluster = process.env.MONGODB_CLUSTER // cluster name: bloglist


// exercise 4.8: set db_name based on env
const db_name = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_DB_NAME
  : process.env.PROD_MONGODB_DB_NAME

logger.info('Node Env:', process.env.NODE_ENV)
logger.info('Database:', db_name )

const MONGODB_URI = `mongodb+srv://${db_user}:${db_password}@${db_cluster}/${db_name}?appName=${db_name}`


module.exports = { MONGODB_URI, PORT }

