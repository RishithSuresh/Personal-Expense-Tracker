import express from 'express';
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../controllers/budgetsController.js';
const router = express.Router();

router.get('/:userId', getBudgets);
router.post('/', addBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;