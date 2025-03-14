# API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Authentication

- **POST** `/auth/register`
  - **Description:** Register a new user.
  - **Request Body:** `{ "username": "string", "password": "string" }`
  - **Response:** Created user object with JWT token.

- **POST** `/auth/login`
  - **Description:** Log in an existing user.
  - **Request Body:** `{ "email": "string", "password": "string" }`
  - **Response:** Authenticated user object with JWT token.