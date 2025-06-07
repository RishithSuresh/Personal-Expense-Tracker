const db = require('../db');

// Get all categories
exports.getCategories = (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
};

// Add a new category
exports.addCategory = (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database insert failed' });
        }
        res.status(201).json({ id: results.insertId, name });
    });
};

// Update a category
exports.updateCategory = (req, res) => {
    const { id, name } = req.body;
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database update failed' });
        }
        res.json({ id, name });
    });
};

// Delete a category
exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database delete failed' });
        }
        res.status(204).send();
    });
};