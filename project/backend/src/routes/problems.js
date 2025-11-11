import express from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problemController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  validateProblem,
  validateProblemQuery,
  validateUUID
} from '../middleware/validation.js';
import { generalLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', generalLimiter, validateProblemQuery, getProblems);
router.get('/:id', generalLimiter, validateUUID, getProblemById);
router.post('/', authenticateAdmin, validateProblem, createProblem);
router.put('/:id', authenticateAdmin, validateUUID, validateProblem, updateProblem);
router.delete('/:id', authenticateAdmin, validateUUID, deleteProblem);

export default router;
