// Full Stack open, The University of Helsinki
// Exercises 4.1 - 4.2 Phonebook backend
// Url : https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2
// Created on 2026-07-15 22:16 HKT

// Change log :
// 1. exercise 4.1: Blog List, step 1 (July 16, 2026)
//    -> turn into a functioning npm project.
// 2. exercise 4.2: Blog List, step 2 (July 16, 2026)
//    -> refactor into separate modules
// 3. exercise 4.8: Blog List Tests, step 1 (July 18, 2026)
//    ->  does not print to console in test mode

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(...params)
  }
}

module.exports = { info, error }