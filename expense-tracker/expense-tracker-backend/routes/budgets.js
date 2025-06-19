import express from 'express';
import { 
    getBudgets, 
    addBudget, 
    updateBudget, 
    deleteBudget, 
    getBudgetSummary, 
    getBudgetAlerts 
} from '../controllers/budgetsController.js';

const router = express.Router();

router.get('/', getBudgets);
router.post('/', addBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.get('/summary', getBudgetSummary);
router.get('/alerts', getBudgetAlerts);

export default router;
