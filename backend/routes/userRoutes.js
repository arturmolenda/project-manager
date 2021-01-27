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
router.post('/find/:projectId', protect, permissionsOne, findUsers);
router.put('/markNotifications', protect, markNotifications);
router.get('/notifications', protect, getNotifications);
router.get('/', protect, getUserData);
router.delete('/:notificationId', protect, discardNotification);

export default router;
