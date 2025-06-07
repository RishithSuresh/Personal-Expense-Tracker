const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');

// Route to get all expenses
router.get('/', expensesController.getAllExpenses);

// Route to add a new expense
router.post('/', expensesController.addExpense);

// Route to delete an expense by ID
router.delete('/:id', expensesController.deleteExpense);

module.exports = router;