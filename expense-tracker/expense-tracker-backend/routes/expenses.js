import express from 'express';
import { getExpenses, addExpense, deleteExpense, getExpensesTotal } from '../controllers/expensesController.js';
const router = express.Router();

router.get('/', getExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.get('/total', getExpensesTotal);

export default router;