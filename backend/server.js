import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import images from './images.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socket } from './socket.js';

dotenv.config();

connectDb();

const app = express();
const server = createServer(app);
const io = new Server(server);
socket(io);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/images', images);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
const PORT = process.env.PORT || 5000;
server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

app.use(notFound);

app.use(errorHandler);
