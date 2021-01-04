import express from 'express';
import {
  authUser,
  confirmEmail,
  registerUser,
  resendEmail,
} from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/confirm', confirmEmail);
router.post('/resend', resendEmail);

export default router;
