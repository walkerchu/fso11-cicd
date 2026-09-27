// Full Stack open, The University of Helsinki
// Exercises 5.13 - 5.16 Blog List Tests
// Url : https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16
// Created on 2026-09-09 01:46 HKT

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
