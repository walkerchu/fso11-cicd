# CI/CD Pipeline for Full Stack Open Part 11

## A. Introduction

An end-to-end full-stack web application built for the [Full Stack Open - Continuous Integration (Part 11)](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-continuous-integration) course, demonstrating modern web development practices, automated testing, and a continuous integration and delivery (CI/CD) pipeline using GitHub Actions.

## B. Key URL

**For Exercise 21 to 23 (CI/CD Pipeline)**

- Production App hosted at Render.com : 
    - https://fso11-cicd-blog-app.onrender.com/
    - Blog Frontend demo login info
        - Demo Username : helen
        - Demo Password : wong

- GitHub Repo (exercise 21 - 23) :
    - https://github.com/walkerchu/fso11-cicd.git
    - Visibility : public

**For Exercise 1 to 20 (Pokedex)**

- Production App hosted at Render.com : 
    - https://fs-pokedex-walker.onrender.com/

- GitHub Repo (exercise 1 - 20) :
    - https://github.com/walkerchu/fso-part11.git
    - Visibility : public



## C. Folder Structure (exercise 21 - 23)

Backend :
```
.
├── .github/
│   └── workflows/  <-- GitHub Actions yaml file
├── controllers/
├── frontend/       <-- Frontend codes
├── models/
├── tests/          <-- Backend unit test script
├── utils/
├── .gitattributes
├── .gitignore
├── .npmrc
├── app.js
├── eslint.config.js
├── index.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

Frontend :
```
.
frontend/
├── e2e_tests/        <-- Playwright e2e test script
├── public/
├── src/
│   ├── components/   <-- Vitest integration test script
│   └── services/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.js
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── testSetup.js
└── vite.config.js

```

## D. Key Configuration Files (Exercise 21 - 23)


- `.github/workflows/pipeline.yml`
    - CI/CD Pipeline : Configures GitHub Actions workflow for linting, testing, building, deploying, and automated version tagging.
    
- `package.json`
    - Project Dependencies & Scripts: Defines NPM scripts (`start`, `build`, `test`), dev dependencies, and runtime packages.

- `frontend/package.json`
    - Frontend Dependencies & Scripts: Manages client-side packages (React, UI components) and frontend-specific build/dev scripts.

- `frontend/playwright.config.js`
    - E2E Test Suite: Settings and base URLs for running Playwright end-to-end integration tests.


## E. Getting Started

> [!IMPORTANT]
> **Use `pnpm` for Dependency Management**
>
> Please use `pnpm` rather than `npm` or `yarn` across this repository. Running `npm install` generates a `package-lock.json` file, which desynchronizes dependencies from `pnpm-lock.yaml` and causes build failures in the GitHub Actions CI/CD pipeline.

### F. Prerequisites

Ensure you have the following installed locally:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### G. Installation

1. Clone the repository:
   
    ```
    git clone https://github.com/walkerchu/fso11-cicd.git
    cd fso11-cicd
    ```
2. Install Dependencies:

    (this repository uses pnpm-workspace.yaml, running pnpm install at the root automatically installs dependencies for both backend and frontend packages.)

    ```
    # Install dependencies
    pnpm install
    ```

3. Configure Environment Variables:

    (create a .env.local file in the root directory for local database access)

    ```
    PORT=3003
    MONGODB_USER=walker_db_user
    MONGODB_PASSWORD=<insert password>    MONGODB_CLUSTER=bloglist.jigk3ym.mongodb.net
    PROD_MONGODB_DB_NAME=bloglist
    TEST_MONGODB_DB_NAME=test_bloglist
    SECRET=<insert jwt_secret>
    ```

## H. Key Available Scripts  (Exercise 21 - 23)

In the project directory, you can run:

| Command | Description |
| --- | --- |
| `pnpm run start:backend` | Starts the production server. |
| `pnpm run dev:backend` | Runs in development mode with live reloading. |
| `pnpm run test:backend` | Runs backend unit and integration test suites using Node.js native test runner. |
| `pnpm run lint:backend` | Checks backend code formatting and syntax against ESLint rules. |
| `pnpm run lint:frontend` | Checks frontend code formatting and syntax against ESLint rules. |
| `pnpm run test:frontend` | Runs end-to-end tests using Playwright. |
| `pnpm run test-vitest:frontend` | Runs integration tests using Vitest. |

---

last modify date : Oct 8, 2026