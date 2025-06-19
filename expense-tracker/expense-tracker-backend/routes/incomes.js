import express from 'express';
import { getIncomes, addIncome, deleteIncome, getIncomesTotal } from '../controllers/incomesController.js';
const router = express.Router();

router.get('/', getIncomes);
router.post('/', addIncome);
router.delete('/:id', deleteIncome);
router.get('/total', getIncomesTotal);

export default router;