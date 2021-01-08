import express from 'express';
import {
  authUser,
  confirmEmail,
  getUserData,
  registerUser,
  resendEmail,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/confirm', confirmEmail);
router.post('/resend', resendEmail);
router.get('/', protect, getUserData);
export default router;
