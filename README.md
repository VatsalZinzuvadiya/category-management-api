# Category Management API

This is a RESTful API for managing categories. It provides endpoints for creating, retrieving, updating, and deleting categories. The API also includes user authentication.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/category-management-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd category-management-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root of the project and add the following environment variables:
   ```
   PORT=3000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   ```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm start
```

This will start the server with nodemon, which will automatically restart the server when you make changes to the code.

To build the application for production, use the following command:

```bash
npm run build
```

To run the built application, use the following command:

```bash
npm run serve
```

## API Endpoints

### Authentication

- **POST /api/auth/register**

  Registers a new user.

  **Request Body:**

  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

- **POST /api/auth/login**

  Logs in a user and returns a JWT token.

  **Request Body:**

  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

### Categories

- **POST /api/categories**

  Creates a new category.

  **Request Body:**

  ```json
  {
    "name": "Electronics",
    "parent": null,
    "status": "active"
  }
  ```

- **GET /api/categories**

  Retrieves all categories.

- **PUT /api/categories/:id**

  Updates a category.

  **Request Body:**

  ```json
  {
    "name": "Mobiles",
    "status": "inactive"
  }
  ```

- **DELETE /api/categories/:id**

  Deletes a category.

## Sample API Responses

### Register User

**Response:**

```json
{
  "message": "User registered successfully"
}
```

### Login User

**Response:**

```json
{
  "token": "your-jwt-token"
}
```

### Create Category

**Response:**

```json
{
  "_id": "60d5f1b3e7b3c2a4e8f3b3a5",
  "name": "Electronics",
  "parent": null,
  "status": "active",
  "__v": 0
}
```

### Get Categories

**Response:**

```json
[
  {
    "_id": "60d5f1b3e7b3c2a4e8f3b3a5",
    "name": "Electronics",
    "parent": null,
    "status": "active",
    "__v": 0
  }
]

## Running with Docker

To build and run the application with Docker, follow these steps:

1.  **Build the Docker image:**

    ```bash
    docker build -t category-management-api .
    ```

2.  **Run the Docker container:**

    Make sure to replace `your-mongodb-connection-string` and `your-jwt-secret` with your actual credentials.

    ```bash
    docker run -p 3000:3000 -e PORT=3000 -e MONGO_URI=your-mongodb-connection-string -e JWT_SECRET=your-jwt-secret category-management-api
    ```

    The application will be accessible at `http://localhost:3000`.
