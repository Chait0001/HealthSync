import express from 'express';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getDoctors);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createDoctor);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateDoctor);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteDoctor);

export default router;
