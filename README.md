# Project Name

Todo List Rest Api

## Dependencies

- [bcrypt](https://www.npmjs.com/package/bcrypt) v5.1.1 - A library for hashing passwords.
- [dotenv](https://www.npmjs.com/package/dotenv) v16.4.5 - Zero-dependency module that loads environment variables.
- [express](https://www.npmjs.com/package/express) v4.18.3 - Fast, unopinionated, minimalist web framework for Node.js.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) v9.0.2 - JSON Web Token (JWT) implementation for Node.js.
- [mongoose](https://www.npmjs.com/package/mongoose) v8.2.1 - MongoDB object modeling tool designed to work in an asynchronous environment.

## Development Dependencies

- [nodemon](https://www.npmjs.com/package/nodemon) v3.1.0 - Utility that will monitor for any changes in your source and automatically restart your server.

## Getting Started

### For better understanding of the endpoints, please download the [TODO LIST REST API.postman_collection.json] file and import it to Postman.

Follow these steps to set up and run the project locally:

1. Clone the repository: `https://github.com/asadsuzan/simple-to-do-list-backend.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

# USER MANAGEMENT

# User Registration

## Endpoint: POST `/user/registration `

### Request:

```json
{
  "userName": "yourUsername",
  "password": "yourPassword",
  "email": "yourEmail@example.com"
}
```

### Response (Success):

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "userId",
    "userName": "yourUsername",
    "email": "yourEmail@example.com",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "User with this username or email already exists"
}
```

# User Login

## Endpoint: POST `/user/login `

### Request:

```json
{
  "email": "yourEmail@example.com",
  "password": "yourPassword"
}
```

### Response (Success):

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": "userId",
    "userName": "yourUsername",
    "email": "yourEmail@example.com",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "token": "yourJWTToken"
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "Invalid email or password"
}
```

# User Profile

## Read User Profile

### Endpoint: GET `/user/profile`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Response (Success):

```json
{
  "status": "success",
  "data": {
    "id": "userId",
    "userName": "yourUsername",
    "email": "yourEmail@example.com",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "User profile not found"
}
```

# Update User Profile

## Endpoint: PUT `/user/profile/edit`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Request:

```json
{
  "userName": "newUsername",
  "password": "newPassword"
}
```

### Response (Success):

```json
{
  "status": "success",
  "message": "Profile updated",
  "data": {
    "id": "userId",
    "userName": "newUsername",
    "email": "yourEmail@example.com",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "User profile not found"
}
```

# Todo Management

# Create Todo

## Endpoint: POST `/todo/create/new`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Request:

```json
{
  "title": "TodoTitle",
  "description": "TodoDescription"
}
```

### Response (Success):

```json
{
  "status": "success",
  "message": "Todo added success",
  "data": {
    "id": "todoId",
    "title": "TodoTitle",
    "description": "TodoDescription",
    "completed": false,
    "userId": "userId",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "There is a problem in your request",
  "hints": "Title field is required"
}
```

# Read Todo List

## Endpoint: GET `/todo/all`

## Request Headers:

### Authorization: Bearer yourJWTToken

#### Response (Success):

```json
{
  "status": "success",
  "message": "All Todos",
  "count": 2,
  "data": [
    {
      "id": "todoId1",
      "title": "TodoTitle1",
      "description": "TodoDescription1",
      "completed": false,
      "userId": "userId",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    },
    {
      "id": "todoId2",
      "title": "TodoTitle2",
      "description": "TodoDescription2",
      "completed": true,
      "userId": "userId",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "Invalid user id"
}
```

# Read Single Todo

## Endpoint: GET `/todo/:id`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Response (Success):

```json
{
  "status": "success",
  "todo": {
    "id": "todoId",
    "title": "TodoTitle",
    "description": "TodoDescription",
    "completed": false,
    "userId": "userId",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "Invalid Todo id"
}
```

# Update Todo

## Endpoint: PUT `/todo/:id`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Request:

```json
{
  "title": "NewTodoTitle",
  "description": "NewTodoDescription",
  "completed": true
}
```

### Response (Success):

```json
{
  "status": "success",
  "message": "Todo Updated successfully"
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "Invalid token id"
}
```

# Delete Todo

## Endpoint: DELETE `/todo/:id`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Response (Success):

```json
{
  "status": "success",
  "message": "Todo deleted Successfully"
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "Invalid Todo Id"
}
```

# Update Todo Status

## Endpoint: PUT `/todo/:id/:complete`

## Request Headers:

### Authorization: Bearer yourJWTToken

### Response (Success):

```json
{
  "status": "success",
  "message": "Todo updated successfully",
  "data": {
    "title": "TodoTitle",
    "description": "TodoDescription",
    "completed": true
  }
}
```

### Response (Error):

```json
{
  "status": "failed",
  "message": "No Todo found associated with id todoId"
}
```
