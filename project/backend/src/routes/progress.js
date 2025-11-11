import express from 'express';
import {
  markAsSolved,
  getProgress,
  deleteProgress
} from '../controllers/progressController.js';
import {
  validateProgress,
  validateProgressQuery
} from '../middleware/validation.js';
import { generalLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', generalLimiter, validateProgress, markAsSolved);
router.get('/', generalLimiter, validateProgressQuery, getProgress);
router.delete('/', generalLimiter, deleteProgress);

export default router;
