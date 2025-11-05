# Node.js Express PostgreSQL API

A RESTful API built with Node.js, Express, and PostgreSQL for managing users.

## Features

- ✅ RESTful API endpoints
- ✅ PostgreSQL database integration
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variable configuration
- ✅ CORS support
- ✅ Security headers

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd node-api-postgres
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your database
   ```sql
   CREATE DATABASE api;
   
   CREATE TABLE users (
     ID SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL
   );
   ```

4. Configure environment variables
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=api
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=3000
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
- **GET** `/health` - Check API and database status

### Users

#### Get All Users
- **GET** `/users`
- **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
  ```

#### Get User by ID
- **GET** `/users/:id`
- **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- **Error:** `404 Not Found` if user doesn't exist

#### Create User
- **POST** `/users`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- **Response:** `201 Created`
  ```
  User added with ID: 1
  ```
- **Errors:**
  - `400 Bad Request` - Missing required fields or invalid email format
  - `409 Conflict` - Email already exists

#### Update User
- **PUT** `/users/:id`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Errors:**
  - `400 Bad Request` - Missing required fields or invalid email format
  - `404 Not Found` - User doesn't exist
  - `409 Conflict` - Email already exists

#### Delete User
- **DELETE** `/users/:id`
- **Response:** `200 OK`
  ```
  User deleted with ID: 1
  ```
- **Error:** `404 Not Found` if user doesn't exist

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message here"
}
```

## Project Structure

```
node-api-postgres/
├── index.js          # Main application entry point
├── queries.js        # Database query functions
├── package.json      # Dependencies and scripts
├── .env              # Environment variables (not in git)
├── .env.example      # Environment variables template
└── README.md         # This file
```

## Technologies Used

- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client for Node.js
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger

## License

ISC

