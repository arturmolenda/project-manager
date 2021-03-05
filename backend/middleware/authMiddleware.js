import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Project from '../models/project.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token in missing');
  }
});
const permissionsOne = asyncHandler(async (req, res, next) => {
  const isAuthorized = await Project.findOne({
    _id: req.params.projectId,
    users: {
      $elemMatch: {
        user: req.user._id,
        permissions: { $in: [1, 2] },
      },
    },
  });
  if (isAuthorized.users.length !== 0) next();
  else {
    res.status(401);
    throw new Error('Not authorized');
  }
});

export { protect, permissionsOne };
