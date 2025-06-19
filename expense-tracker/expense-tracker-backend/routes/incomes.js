import express from 'express';
import { getIncomes, addIncome, deleteIncome } from '../controllers/incomesController.js';
const router = express.Router();

router.get('/', getIncomes);
router.post('/', addIncome);
router.delete('/:id', deleteIncome);

export default router;