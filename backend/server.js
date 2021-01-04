import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

connectDb();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

app.use(notFound);

app.use(errorHandler);
