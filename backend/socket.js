import { protect } from './middleware/authMiddleware.js';

const wrap = (middleware) => (socket, next) =>
  middleware(socket.handshake.auth, {}, next);

export const socket = (io) => {
  io.use(wrap(protect));
  io.on('connection', (socket) => {
    socket.user = socket.handshake.auth.user;
    console.log('User connected:', socket.id);
    console.log('Connected users:', io.sockets.server.eio.clientsCount);
  });
  io.on('disconnect', (socket) => {
    console.log('User disconnected.');
  });
};
