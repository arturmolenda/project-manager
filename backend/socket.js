import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from './models/user.js';

const authorizeSocketConnection = asyncHandler(async (req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  return user;
});

export const socket = (io) => {
  io.on('connection', async (socket) => {
    // Authorize user upon initial connection
    const user = await authorizeSocketConnection(socket.handshake.auth, socket);
    if (user) socket.user = user;
    else socket.disconnect(true);

    console.log('Connected users:', io.sockets.server.eio.clientsCount);

    socket.on('join-board', ({ room }) => {
      console.log('joined board', room);
      socket.join(room);
    });

    socket.on('disconnect-board', ({ room }) => {
      console.log('disconnected-board', room);
      socket.leave(room);
    });
  });
  io.on('disconnect', (socket) => {
    console.log('User disconnected.');
  });
};
