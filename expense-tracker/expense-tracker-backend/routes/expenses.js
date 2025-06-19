import express from 'express';
import { getExpenses, addExpense, deleteExpense, getExpensesTotal, getExpensesByCategory, getExpensesTimeSeries } from '../controllers/expensesController.js';
const router = express.Router();

router.get('/', getExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.get('/total', getExpensesTotal);
router.get('/by-category', getExpensesByCategory);
router.get('/time-series', getExpensesTimeSeries);

export default router;