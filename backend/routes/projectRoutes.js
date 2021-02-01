import express from 'express';
import {
  createProject,
  getProjectData,
  getTask,
} from '../controllers/projectController.js';
import { protect, permissionsOne } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, createProject);
router.get('/:projectId', protect, permissionsOne, getProjectData);
router.get('/getTask/:projectId/:taskId', protect, permissionsOne, getTask);

export default router;
