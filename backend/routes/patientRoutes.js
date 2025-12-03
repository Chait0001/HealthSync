import express from 'express';
import { getPatients, createPatient, updatePatient, deletePatient } from '../controllers/patientController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All patient routes require authentication
router.get('/', authMiddleware, getPatients);
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'DOCTOR']), createPatient);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'DOCTOR']), updatePatient);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deletePatient);

export default router;
