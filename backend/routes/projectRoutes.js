import express from 'express';
import {
  createProject,
  getProjectData,
} from '../controllers/projectController.js';
import { protect, permissionsOne } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, createProject);
router.get('/:projectId', protect, permissionsOne, getProjectData);

export default router;
