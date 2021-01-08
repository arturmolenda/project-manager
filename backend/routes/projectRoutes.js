import express from 'express';
import { createProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, createProject);

export default router;
