const db = require('../db');

// Get all budgets
exports.getBudgets = (req, res) => {
    db.query('SELECT * FROM budgets', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
};

// Add a new budget
exports.addBudget = (req, res) => {
    const { amount, description } = req.body;
    db.query('INSERT INTO budgets (amount, description) VALUES (?, ?)', [amount, description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database insert failed' });
        }
        res.status(201).json({ id: results.insertId, amount, description });
    });
};

// Update a budget
exports.updateBudget = (req, res) => {
    const { id } = req.params;
    const { amount, description } = req.body;
    db.query('UPDATE budgets SET amount = ?, description = ? WHERE id = ?', [amount, description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database update failed' });
        }
        res.json({ id, amount, description });
    });
};

// Delete a budget
exports.deleteBudget = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM budgets WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database delete failed' });
        }
        res.status(204).send();
    });
};