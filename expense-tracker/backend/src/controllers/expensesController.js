const db = require('../db');

// Get all expenses
exports.getExpenses = (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
};

// Add a new expense
exports.addExpense = (req, res) => {
    const { description, amount, category, date } = req.body;
    const query = 'INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)';
    
    db.query(query, [description, amount, category, date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add expense' });
        }
        res.status(201).json({ id: results.insertId, description, amount, category, date });
    });
};

// Delete an expense
exports.deleteExpense = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM expenses WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete expense' });
        }
        res.status(204).send();
    });
};