# API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### Authentication

#### **POST** `/auth/register`
- **Description:** Register a new user.
- **Request Body:**
```json
{
  "username": "string",
  "password": "string"
}