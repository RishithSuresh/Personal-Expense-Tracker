import express from 'express';
import { getIncomes, addIncome, deleteIncome, getIncomesTotal, getIncomesBySource, getIncomesTimeSeries } from '../controllers/incomesController.js';
const router = express.Router();

router.get('/', getIncomes);
router.post('/', addIncome);
router.delete('/:id', deleteIncome);
router.get('/total', getIncomesTotal);
router.get('/by-source', getIncomesBySource);
router.get('/time-series', getIncomesTimeSeries);

export default router;