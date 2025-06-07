const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Route to get the current budget
router.get('/', budgetController.getBudget);

// Route to set a new budget
router.post('/', budgetController.setBudget);

// Route to update an existing budget
router.put('/:id', budgetController.updateBudget);

// Route to delete a budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;