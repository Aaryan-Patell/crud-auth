

A basic full-stack authentication and product CRUD application built using Node.js, Express.js, MongoDB, JWT, HTML, CSS, and JavaScript.

---

# Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- CORS

---

# Folder Structure

```text
auth-crud/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── client/
│   ├── index.html
│   ├── register.html
│   ├── products.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

---

# Project Working

The application has two main parts:

- Frontend
- Backend

The frontend sends requests to the Express backend.

The backend handles authentication, validates requests, communicates with MongoDB, and sends responses back to the frontend.

```text
Frontend
    ↓
Express API
    ↓
Middleware
    ↓
Controller
    ↓
MongoDB
    ↓
Response
    ↓
Frontend
```

---

# Authentication

The application uses:

- Access Token
- Refresh Token

After successful login, the server generates both tokens.

The Access Token is stored in Local Storage and is used for protected API requests.

The Refresh Token is stored in an HTTP-only cookie.

```text
Login
  ↓
Access Token
  ↓
Local Storage

Login
  ↓
Refresh Token
  ↓
HTTP-only Cookie
```

When the Access Token expires, the Refresh Token is used to generate a new Access Token.

---

# Authentication API

## Register

### Endpoint

```http
POST /api/auth/register
```

### Purpose

Creates a new user account.

### Authentication

Not required.

### Request Body

```json
{
    "name": "Aryan",
    "email": "aryan@example.com",
    "password": "123456"
}
```

### Working

```text
Register Request
      ↓
Validate User
      ↓
Hash Password
      ↓
Save User
      ↓
MongoDB
      ↓
Response
```

---

# Login

### Endpoint

```http
POST /api/auth/login
```

### Purpose

Authenticates the user and generates Access and Refresh Tokens.

### Authentication

Not required.

### Request Body

```json
{
    "email": "aryan@example.com",
    "password": "123456"
}
```

### Working

```text
Login Request
      ↓
Find User
      ↓
Compare Password
      ↓
Create Access Token
      ↓
Create Refresh Token
      ↓
Save Refresh Token
      ↓
Return Access Token
      ↓
Set Refresh Token Cookie
```

---

# Refresh Access Token

### Endpoint

```http
POST /api/auth/refresh
```

### Purpose

Generates a new Access Token when the existing Access Token expires.

### Authentication

Refresh Token cookie required.

### Request Body

No request body is required.

### Working

```text
Refresh Request
      ↓
Get Refresh Token from Cookie
      ↓
Verify Refresh Token
      ↓
Find User
      ↓
Check Refresh Token
      ↓
Create New Access Token
      ↓
Create New Refresh Token
      ↓
Update Refresh Token
      ↓
Return New Access Token
```

---

# Get Current User

### Endpoint

```http
GET /api/auth/me
```

### Purpose

Returns the currently authenticated user's information.

### Authentication

Access Token required.

### Header

```http
Authorization: Bearer <access-token>
```

### Working

```text
Request
   ↓
Auth Middleware
   ↓
Verify Access Token
   ↓
Get User ID
   ↓
Find User
   ↓
Return User
```

---

# Logout

### Endpoint

```http
POST /api/auth/logout
```

### Purpose

Logs the user out and removes the Refresh Token.

### Authentication

Not required.

### Working

```text
Logout Request
      ↓
Remove Refresh Token
      ↓
Clear Cookie
      ↓
Logout Complete
```

The frontend also removes the Access Token from Local Storage.

---

# Product APIs

All product APIs require a valid Access Token.

Header:

```http
Authorization: Bearer <access-token>
```

---

# Create Product

### Endpoint

```http
POST /api/products
```

### Purpose

Creates a new product.

### Authentication

Access Token required.

### Request Body

```json
{
    "name": "Laptop",
    "price": 50000,
    "description": "Gaming laptop"
}
```

### Working

```text
Request
   ↓
Auth Middleware
   ↓
Verify Access Token
   ↓
Product Controller
   ↓
Create Product
   ↓
MongoDB
   ↓
Response
```

---

# Get Products

### Endpoint

```http
GET /api/products
```

### Purpose

Returns products stored in MongoDB.

### Authentication

Access Token required.

### Header

```http
Authorization: Bearer <access-token>
```

### Working

```text
Request
   ↓
Auth Middleware
   ↓
Verify Access Token
   ↓
Product Controller
   ↓
Get Products
   ↓
MongoDB
   ↓
Return Products
```

---

# Update Product

### Endpoint

```http
PUT /api/products/:id
```

### Purpose

Updates an existing product.

`:id` is the MongoDB ID of the product.

### Authentication

Access Token required.

### Request Body

```json
{
    "name": "Updated Laptop",
    "price": 55000,
    "description": "Updated gaming laptop"
}
```

### Example

```http
PUT /api/products/PRODUCT_ID
```

### Working

```text
Request
   ↓
Auth Middleware
   ↓
Verify Access Token
   ↓
Find Product
   ↓
Update Product
   ↓
MongoDB
   ↓
Response
```

---

# Delete Product

### Endpoint

```http
DELETE /api/products/:id
```

### Purpose

Deletes an existing product.

`:id` is the MongoDB ID of the product.

### Authentication

Access Token required.

### Example

```http
DELETE /api/products/PRODUCT_ID
```

### Working

```text
Request
   ↓
Auth Middleware
   ↓
Verify Access Token
   ↓
Find Product
   ↓
Delete Product
   ↓
MongoDB
   ↓
Response
```

---

# API Summary

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/refresh` | Refresh Cookie | Generate new Access Token |
| GET | `/api/auth/me` | Access Token | Get current user |
| POST | `/api/auth/logout` | No | Logout user |
| POST | `/api/products` | Access Token | Create product |
| GET | `/api/products` | Access Token | Get products |
| PUT | `/api/products/:id` | Access Token | Update product |
| DELETE | `/api/products/:id` | Access Token | Delete product |

---

# CRUD Flow

```text
CREATE
POST /api/products
       ↓
Create Product


READ
GET /api/products
       ↓
Get Products


UPDATE
PUT /api/products/:id
       ↓
Update Product


DELETE
DELETE /api/products/:id
       ↓
Delete Product
```

---

