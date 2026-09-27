// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Phonebook backend
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-15 23:24 HKT

// Change log :
// 1. exercise 4.1: Blog List, step 1 (July 16, 2026)
//    -> turn into a functioning npm project.
// 2. exercise 4.2: Blog List, step 2 (July 16, 2026)
//    -> refactor into separate modules.


const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT} at ${Date()}`)
})