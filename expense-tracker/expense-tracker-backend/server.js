import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import categoriesRoutes from './routes/categories.js';
import expensesRoutes from './routes/expenses.js';
import incomesRoutes from './routes/incomes.js';
import budgetsRoutes from './routes/budgets.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/incomes', incomesRoutes);
app.use('/api/budgets', budgetsRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));