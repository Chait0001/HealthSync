import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Simple logging for auth routes
router.use((req, _res, next) => {
  console.log(`[AUTH] ${req.method} ${req.path}`);
  next();
});

router.post('/signup', signup);
router.post('/login', login);

export default router;
