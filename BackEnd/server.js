const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RishithRockz10',
    database: 'expense_tracker'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Expenses APIs
app.get('/api/expenses', (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/api/expenses', (req, res) => {
    const { date, description, category, amount, paymentMethod } = req.body;
    db.query(
        'INSERT INTO expenses (date, description, category, amount, payment_method) VALUES (?, ?, ?, ?, ?)',
        [date, description, category, amount, paymentMethod],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId });
        }
    );
});

// Budgets APIs
app.get('/api/budgets', (req, res) => {
    db.query('SELECT * FROM budgets', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/api/budgets', (req, res) => {
    const { category, limit } = req.body;
    db.query(
        'INSERT INTO budgets (category, limit_amount) VALUES (?, ?) ON DUPLICATE KEY UPDATE limit_amount = ?',
        [category, limit, limit],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ success: true });
        }
    );
});

// Categories APIs
app.get('/api/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/api/categories', (req, res) => {
    const { name } = req.body;
    db.query(
        'INSERT INTO categories (name) VALUES (?)',
        [name],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId });
        }
    );
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});