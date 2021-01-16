import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Project from '../models/project.js';

const authorizeSocketConnection = asyncHandler(async (data, socket) => {
  const token = data.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) socket.emit('auth-error');
  else socket.user = user;
});

const levelOneAuth = asyncHandler(async (data, socket) => {
  const isAuthorized = await Project.findOne({
    _id: data.projectId,
    'users.user': socket.user._id,
  });
  if (!isAuthorized) socket.emit('auth-error');
});

const levelTwoAuth = asyncHandler(async (data, socket) => {
  const isAuthorized = await Project.findOne({
    _id: data.projectId,
    users: {
      $elemMatch: {
        user: socket.user._id,
        permissions: 2,
      },
    },
  });
  if (!isAuthorized) socket.emit('auth-error');
});

export { authorizeSocketConnection, levelOneAuth, levelTwoAuth };
