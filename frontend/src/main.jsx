// Full Stack open, The University of Helsinki
// Exercises 5.24–5.28 Routed Blogs
// Url : https://fullstackopen.com/en/part5/react_router_ui_frameworks#exercises-5-24-5-28
// Modified on 2026-09-15 00:25 HKT

// Change log :
// 1. exercise 5.24: routed blogs, step1 (Sept 15, 2026)
//    -> Add React Router and navigation bar

import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import App from './App'

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <Router><App /></Router>
  )