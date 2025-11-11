import { body, query, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateProblem = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('category').notEmpty().trim().withMessage('Category is required'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('hint').optional().trim(),
  body('explanation').optional().trim(),
  body('time_complexity').optional().trim(),
  body('space_complexity').optional().trim(),
  body('sample_input').optional().trim(),
  body('sample_output').optional().trim(),
  body('starter_code').optional().trim(),
  validate
];

export const validateProgress = [
  body('userId').notEmpty().trim().withMessage('userId is required'),
  body('problemId').isUUID().withMessage('Valid problemId is required'),
  validate
];

export const validateProblemQuery = [
  query('category').optional().trim(),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

export const validateProgressQuery = [
  query('userId').optional().trim(),
  query('category').optional().trim(),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  validate
];

export const validateUUID = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate
];
