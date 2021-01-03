import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import morgan from 'morgan';
dotenv.config();

connectDb();

const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
