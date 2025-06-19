import express from 'express';
import { 
    getMonthlyAnalytics,
    getYearlyAnalytics,
    getSpendingTrends,
    getFinancialHealth,
    getTopExpenseCategories,
    getIncomeSourceAnalysis,
    getDailySpendingPattern
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/monthly', getMonthlyAnalytics);
router.get('/yearly', getYearlyAnalytics);
router.get('/spending-trends', getSpendingTrends);
router.get('/financial-health', getFinancialHealth);
router.get('/top-categories', getTopExpenseCategories);
router.get('/income-sources', getIncomeSourceAnalysis);
router.get('/daily-pattern', getDailySpendingPattern);

export default router;
