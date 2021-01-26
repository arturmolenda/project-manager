import express from 'express';
import {
  authUser,
  confirmEmail,
  getUserData,
  registerUser,
  resendEmail,
  findUsers,
  markNotifications,
  getNotifications,
  discardNotification,
} from '../controllers/userController.js';
import { protect, permissionsOne } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/confirm', confirmEmail);
router.post('/resend', resendEmail);
router.post('/markNotifications', markNotifications);
router.post('/find/:projectId', protect, permissionsOne, findUsers);
router.get('/notifications', protect, getNotifications);
router.get('/', protect, getUserData);
router.delete('/:notificationId', protect, discardNotification);

export default router;
