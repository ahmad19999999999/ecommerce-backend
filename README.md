# 🛒 E-Commerce Backend API

Backend RESTful API for an E-commerce platform built with **Node.js**, **Express**, and **MongoDB**.  
Supports user authentication, product management, order handling, and admin roles.

---

## 🚀 Features

- User registration & login with JWT authentication  
- Role-based access control (User / Admin)  
- Product management (Create, Read, Update, Delete)  
- Order creation and management  
- Email notifications via SMTP (Gmail)  
- Cloudinary integration for image uploads  
- Secure environment variable handling  

---

## 🧰 Tech Stack

- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JSON Web Tokens (JWT)  
- Nodemailer (SMTP email)  
- Cloudinary (image hosting)  
- dotenv  

---

## ⚙️ Environment Variables & Getting Started

### 📄 Environment Variables

Create a `.env` file in the root of the project and add the following variables:
 ``` 
PORT=
MONGO_URI=
JWT_SECRET_KEY=
EXPIRES=
COOKIE_EXPIRE=
SMTP_SERVICE=
SMTP_MAIL=
SMTP_PASS=
CLOUDINARY_NAME=
API_KEY=
API_KEY_SECRET=
 ``` 
---
## 🛠️ Installation

### Clone the repository:
   
   git clone https://github.com/ahmad19999999999/ecommerce-backend.
   
### Navigate to the project directory:
   cd ecommerce-backend

### Install dependencies:
   npm install

### Copy the example environment file and configure it:
   cp .env.example .env

### Start the server:
   npm run start
---
## 📂 Project Structure
 ``` 
ecommerce-backend/
├── controllers/        # Business logic for API endpoints
├── routes/             # API route definitions
├── models/             # Mongoose schemas
├── middlewares/        # Authentication & error handling
├── config/             # Database connection & Cloudinary setup
├── server.js           # Application entry point
└── .env.example        # Example environment variables
 ``` 
---
##📬 Contact
  Email:alabadallahahmad16@gmail.com
  phone:+963969793510 






 
