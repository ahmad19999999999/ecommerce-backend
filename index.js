import express from 'express';
import dotenv from 'dotenv';
import product from './router/routerproduct.js';
import connectDB from './confige/db.js';
import errorMiddleware from './midalware/errorMiddleware.js'; // صححت الاسم
import user from './router/userrouter.js';
import cookieParser from 'cookie-parser';
import order from './router/orderrouter.js';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
// لو مش تستخدم رفع ملفات multipart احذف هذه السطر
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_KEY_SECRET
});

connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
// لو مش تستخدم رفع ملفات multipart احذف هذه السطر
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

app.use(errorMiddleware);

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

